#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod clients;
mod errors;
mod schemas;

use clients::APIClient;
use errors::{handle_request_error, handle_response_error};
use schemas::{GeneratorResponseData,ConverterResponseData};
use serde::Serialize;
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::Arc;
use tauri::Builder;
use tauri::Manager;
use tauri::async_runtime;
use tokio_util::sync::CancellationToken;
use std::process::{Command,Stdio};
use std::io::prelude::*;
use std::io::BufReader;
use tokio::sync::Mutex;
use tauri_plugin_log::LogTarget;
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
async fn call_circuit_converter_api(flow_json: String) -> Result<ConverterResponseData, String> {
    let response = APIClient::send_request_circuit_converter(flow_json).await;

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

#[derive(Serialize)]
struct FileEntry {
    path: String,
    is_dir: bool,
    children: Option<Vec<FileEntry>>,
}

#[tauri::command]
fn read_dir_recursive(path: &Path) -> Result<FileEntry, String> {
    let mut entry = FileEntry {
        path: path.display().to_string(),
        is_dir: path.is_dir(),
        children: None,
    };

    if path.is_dir() {
        let children = fs::read_dir(path)
            .map_err(|err| err.to_string())?
            .filter_map(|entry| entry.ok())
            .map(|entry| read_dir_recursive(&entry.path()))
            .collect::<Result<Vec<_>, _>>()?;
        entry.children = Some(children);
    }

    Ok(entry)
}

#[tauri::command]
fn read_dir(path: String) -> Result<FileEntry, String> {
    let path = Path::new(&path);
    read_dir_recursive(path)
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
                        LogTarget::Stdout, 
                        LogTarget::Webview,
                        LogTarget::LogDir,
                    ])
                    .level(LevelFilter::Info)
                    .build(),
            )
        .manage(state)
        .setup(|app| {
            let _ = fix_path_env::fix();

            let resource_path = app.path_resolver()
            .resolve_resource("compose.yml")
            .expect("failed to resolve resource");

            app.manage(ResourcePath(resource_path.clone()));

            info!("Resource path: {:?}", resource_path);

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
            read_dir
        ])
        .on_window_event(|event|{
        if let tauri::WindowEvent::CloseRequested { .. } = event.event() {
            let app_handle = event.window().app_handle();
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
