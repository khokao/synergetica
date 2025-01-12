mod api;

use api::{APIClient, GeneratorResponseData};
use std::collections::HashMap;
use std::sync::Arc;
use tauri_plugin_shell::process::CommandEvent;
use tauri_plugin_shell::ShellExt;
use tokio::sync::Mutex;
use tokio::time::{timeout, Duration};
use tokio_util::sync::CancellationToken;

const DOCKER_CONTAINER_NAME: &str = "synergetica_api";
const DOCKER_IMAGE: &str = "khokao/synergetica:latest";
const DOCKER_PORT_MAPPING: &str = "7007:7007";
const DOCKER_PATH_CANDIDATES: &[&str] = &[
    // macOS
    "/opt/homebrew/bin/docker",
    "/usr/local/bin/docker",
    "/opt/local/bin/docker",
    "/usr/bin/docker",
    "/bin/docker",
    "/usr/sbin/docker",
    "/sbin/docker",
    // Windows
    r"C:\Program Files\Docker\Docker\resources\bin\docker.exe",
    r"C:\Program Files (x86)\Docker\Docker\resources\bin\docker.exe",
    r"C:\Program Files\Docker Toolbox\docker.exe",
    r"C:\Program Files (x86)\Docker Toolbox\docker.exe",
    r"C:\Docker\docker.exe",
];

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
        let mut locked_state = state.lock().await;
        locked_state.cancellation_token = cancellation_token.clone();
    }
    let api_call = APIClient::generate(protein_target_values, protein_init_sequences);
    tokio::select! {
        result = api_call => result.map_err(|e| e.to_string()),
        _ = cancellation_token.cancelled() => Err("Request was canceled".into()),
    }
}

#[tauri::command]
async fn cancel_generator_api(state: tauri::State<'_, Arc<Mutex<AppState>>>) -> Result<(), ()> {
    let locked_state = state.lock().await;
    locked_state.cancellation_token.cancel();
    Ok(())
}

async fn docker_command(
    app_handle: &tauri::AppHandle,
    action: &str,
    args: &[&str],
    success_msg: &str,
    fail_msg: &str,
    container_name: &str,
    timeout_secs: u64,
) {
    println!("[tauri] {action}...");

    let docker_path = DOCKER_PATH_CANDIDATES
        .iter()
        .find(|&&path| std::path::Path::new(path).exists())
        .map(|&path| path.to_string());

    let Some(docker_path) = docker_path else {
        eprintln!("Could not find 'docker' in known paths.");
        return;
    };

    let shell = app_handle.shell();
    match shell.command(docker_path).args(args).spawn() {
        Err(e) => eprintln!("[tauri] Command spawn error: {e}"),
        Ok((mut rx, child)) => {
            let result = timeout(Duration::from_secs(timeout_secs), async {
                while let Some(event) = rx.recv().await {
                    match event {
                        CommandEvent::Terminated(payload) => {
                            if let Some(code) = payload.code {
                                if code == 0 {
                                    println!("[tauri] {success_msg}");
                                } else {
                                    eprintln!("[tauri] {fail_msg}: exit code {code}");
                                }
                            } else {
                                eprintln!("[tauri] {fail_msg}: no exit code");
                            }
                            return;
                        }
                        CommandEvent::Stderr(line) => {
                            eprintln!("[tauri] docker stderr: {}", String::from_utf8_lossy(&line));
                        }
                        CommandEvent::Stdout(line) => {
                            println!("[tauri] docker stdout: {}", String::from_utf8_lossy(&line));
                        }
                        CommandEvent::Error(err) => {
                            eprintln!("[tauri] Command error: {err}");
                            return;
                        }
                        _ => {
                            eprintln!("[tauri] Unhandled CommandEvent variant for `{container_name}`");
                        }
                    }
                }
            })
            .await;
            if result.is_err() {
                eprintln!("[tauri] Timeout: {fail_msg}. Killing process...");
                if let Err(kill_err) = child.kill() {
                    eprintln!("[tauri] Failed to kill child process: {kill_err}");
                }
            }
        }
    }
}

async fn docker_remove_container(app_handle: &tauri::AppHandle) {
    docker_command(
        app_handle,
        "Removing Docker container",
        &["rm", "-f", DOCKER_CONTAINER_NAME],
        &format!("Docker container `{}` removed.", DOCKER_CONTAINER_NAME),
        &format!("Failed to remove Docker container `{}`", DOCKER_CONTAINER_NAME),
        DOCKER_CONTAINER_NAME,
        5,
    )
    .await;
}

async fn docker_run_container(app_handle: &tauri::AppHandle) {
    docker_remove_container(app_handle).await;
    docker_command(
        app_handle,
        "Running Docker container",
        &[
            "run",
            "-d",
            "-p",
            DOCKER_PORT_MAPPING,
            "--name",
            DOCKER_CONTAINER_NAME,
            DOCKER_IMAGE,
        ],
        &format!("Docker container `{}` is now running.", DOCKER_CONTAINER_NAME),
        &format!("Failed to run Docker container `{}`", DOCKER_CONTAINER_NAME),
        DOCKER_CONTAINER_NAME,
        30,
    )
    .await;
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
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                docker_run_container(&app_handle).await;
            });
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
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
                let app_handle = app_handle.clone();
                tauri::async_runtime::spawn(async move {
                    docker_remove_container(&app_handle).await;
                    std::process::exit(0);
                });
            }
            _ => {}
        });
}
