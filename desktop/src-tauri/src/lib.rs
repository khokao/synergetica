mod api;

use api::{APIClient, GeneratorResponseData};
use std::collections::HashMap;
use std::sync::Arc;
use tauri::RunEvent;
use tauri_plugin_shell::ShellExt;
use tokio::sync::Mutex;
use tokio_util::sync::CancellationToken;

struct AppState {
    cancellation_token: CancellationToken,
}

#[tauri::command]
async fn call_healthcheck() -> Result<String, String> {
    match APIClient::healthcheck().await {
        Ok(_) => Ok("ok".to_string()),
        Err(e) => Err(e),
    }
}

#[tauri::command]
async fn call_generator_api(
    protein_target_values: HashMap<String, f64>,
    protein_init_sequences: HashMap<String, String>,
    state: tauri::State<'_, Arc<Mutex<AppState>>>,
) -> Result<GeneratorResponseData, String> {
    let cancellation_token = CancellationToken::new();

    {
        let mut state = state.lock().await;
        state.cancellation_token = cancellation_token.clone();
    }

    let api_call = APIClient::generate(protein_target_values, protein_init_sequences);

    tokio::select! {
        result = api_call => result.map_err(|e| e.to_string()),
        _ = cancellation_token.cancelled() => Err("Request was canceled".into()),
    }
}

#[tauri::command]
async fn cancel_generator_api(state: tauri::State<'_, Arc<Mutex<AppState>>>) -> Result<(), ()> {
    let state = state.lock().await;
    state.cancellation_token.cancel();
    Ok(())
}

fn check_docker_available(app_handle: &tauri::AppHandle) -> Result<(), String> {
    println!("[tauri] Checking if Docker is available...");

    let shell = app_handle.shell();
    let output = tauri::async_runtime::block_on(async { shell.command("docker").args(["info"]).output().await })
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        println!("[tauri] Docker is installed and available.");
        Ok(())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Docker is not available or not running.\nStderr: {stderr}"))
    }
}

fn docker_run_container(app_handle: &tauri::AppHandle) -> Result<String, String> {
    docker_remove_container(app_handle).ok();

    println!("[tauri] Running Docker container...");

    let container_name = "my_container";
    let image_name = "myapp";

    let shell = app_handle.shell();

    let output = tauri::async_runtime::block_on(async {
        shell
            .command("docker")
            .args(["run", "-d", "-p", "8000:8000", "--name", container_name, image_name])
            .output()
            .await
    })
    .map_err(|e| e.to_string())?;

    if output.status.success() {
        println!("[tauri] Docker container `{container_name}` is now running.");
        Ok(format!("Docker container `{container_name}` is now running."))
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        eprintln!("[tauri] Failed to run Docker container `{container_name}`: {stderr}");
        Err(format!("Failed to run Docker container `{container_name}`: {stderr}"))
    }
}

fn docker_remove_container(app_handle: &tauri::AppHandle) -> Result<String, String> {
    println!("[tauri] Removing Docker container...");

    let container_name = "my_container";
    let shell = app_handle.shell();

    let output = tauri::async_runtime::block_on(async {
        shell
            .command("docker")
            .args(["rm", "-f", container_name])
            .output()
            .await
    })
    .map_err(|e| e.to_string())?;

    if output.status.success() {
        println!("[tauri] Docker container `{container_name}` removed.");
        Ok(format!("Docker container `{container_name}` removed."))
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        eprintln!("[tauri] Failed to remove Docker container `{container_name}`: {stderr}");
        Err(format!(
            "Failed to remove Docker container `{container_name}`: {stderr}"
        ))
    }
}

pub fn run() {
    let state = Arc::new(Mutex::new(AppState {
        cancellation_token: CancellationToken::new(),
    }));

    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .manage(state)
        .setup(|app| {
            if let Err(e) = check_docker_available(&app.handle()) {
                eprintln!("[tauri] Docker check failed: {e}");
            } else {
                if let Err(e) = docker_run_container(&app.handle()) {
                    eprintln!("[tauri] Failed to run Docker container: {e}");
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            call_healthcheck,
            call_generator_api,
            cancel_generator_api,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app_handle, event| match event {
            RunEvent::ExitRequested { .. } => {
                docker_remove_container(app_handle).ok();
            }
            _ => {}
        });
}
