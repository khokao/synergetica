#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod clients;
mod errors;
mod schemas;

use clients::APIClient;
use errors::{handle_request_error, handle_response_error};
use schemas::{ConverterResponseData, GeneratorResponseData};
use std::collections::HashMap;
use std::sync::Arc;
use tauri::Builder;
use tauri::Manager;
use tauri::path::BaseDirectory;
use tauri::async_runtime;
use tokio_util::sync::CancellationToken;
use std::process::{Command,Stdio};
use std::io::prelude::*;
use std::io::BufReader;
use tokio::sync::Mutex;
use tauri_plugin_log::{Target,TargetKind};
use log::{info,LevelFilter};

struct AppState {
    cancellation_token: CancellationToken,
}

#[tauri::command]
async fn call_generator_api(
    reactflow_object_json_str: String,
    rbs_target_parameters: HashMap<String, f64>,
    state: tauri::State<'_, Arc<Mutex<AppState>>>,
) -> Result<GeneratorResponseData, String> {
    let token = CancellationToken::new();
    {
        let mut state = state.lock().await;
        state.cancellation_token = token.clone();
    }

    let response = tokio::select! {
        resp = APIClient::send_request_generation(
            reactflow_object_json_str,
            rbs_target_parameters,
        ) => resp,
        _ = token.cancelled() => {
            return Err("Request was canceled".into());
        }
    };

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                APIClient::parse_response(resp).await
            } else {
                Err(handle_response_error(resp.status()))
            }
        }
        Err(e) => Err(handle_request_error(e)),
    }
}

#[tauri::command]
async fn cancel_generator_api(state: tauri::State<'_, Arc<Mutex<AppState>>>) -> Result<(), ()> {
    let state = state.lock().await;
    state.cancellation_token.cancel();
    Ok(())
}

#[tauri::command]
async fn call_circuit_converter_api(reactflow_object_json_str: String) -> Result<ConverterResponseData, String> {
    let response = APIClient::send_request_circuit_converter(reactflow_object_json_str).await;

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                APIClient::parse_response_circuit_converter(resp).await
            } else {
                Err(handle_response_error(resp.status()))
            }
        }
        Err(e) => Err(handle_request_error(e)),
    }
}

#[tokio::main]
async fn main() {
    let state = Arc::new(Mutex::new(AppState {
        cancellation_token: CancellationToken::new(),
    }));

    struct ResourcePath(std::path::PathBuf);

    Builder::default()
        .plugin(
                tauri_plugin_log::Builder::new()
                    .targets([
                        Target::new(TargetKind::Stdout),
                        Target::new(TargetKind::Webview),
                        Target::new(TargetKind::LogDir { file_name: None }),
                    ])
                    .level(LevelFilter::Info)
                    .build(),
            )
        .manage(state)
        .setup(|app| {
            let _ = fix_path_env::fix();
            let image_name = "thickstem78/gene-circuit-ide:dev";
            // check if image exists 
            let mut inspect_out = Command::new("docker")
                    .arg("inspect")
                    .arg("--type=image")
                    .arg(image_name)
                    .stdout(Stdio::piped())
                    .spawn()
                    .expect("Failed to start docker-compose up");

            let mut inspect_stdout = inspect_out.stdout.take().unwrap();
            let mut inspect_output = String::new();
            inspect_stdout.read_to_string(&mut inspect_output)?;
            info!("Inspect output: {}", inspect_output);
            
            if inspect_output == "[]\n" {
                info!("Image not found, pulling from docker hub");
                let mut pull_out = Command::new("docker")
                    .arg("pull")
                    .arg(image_name)
                    .stdout(Stdio::piped())
                    .spawn()
                    .expect("Failed to pull docker image");
                
                let pull_stdout = pull_out.stdout.take().unwrap();
                let pull_reader = BufReader::new(pull_stdout);
                for pull_line in pull_reader.lines() {
                    info!("{}", pull_line?);
                }

            } else {
                info!("Image found, skipping pull");
            }

            // get compose.yml file path
            let resource_path = app.path()
            .resolve("compose.yml", BaseDirectory::Resource)?;

            app.manage(ResourcePath(resource_path.clone()));

            info!("Resource path: {:?}", resource_path);

            // start backend servers by docker-compose
            let mut child = Command::new("docker-compose")
                    .arg("-f")
                    .arg(resource_path)
                    .arg("up")
                    .arg("-d")
                    .stdout(Stdio::piped())
                    .spawn()
                    .expect("Failed to start docker-compose up");
                
            let stdout = child.stdout.take().unwrap();
            let reader = BufReader::new(stdout);
            for line in reader.lines() {
                info!("{}", line?);
            }
            
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            call_generator_api,
            cancel_generator_api,
            call_circuit_converter_api,
        ])
        .on_window_event(|window, event|{
        if let tauri::WindowEvent::CloseRequested { .. } = event {
            let app_handle = window.app_handle();
            let resource_path = app_handle.state::<ResourcePath>().0.clone();
                
           
            async_runtime::spawn_blocking(move || {
            Command::new("docker-compose")
                .arg("-f")
                .arg(resource_path)
                .arg("down")
                .spawn()
                .expect("Failed to run docker-compose down");
                });
            }
        })

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
