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
use tokio::sync::Mutex;
use tokio_util::sync::CancellationToken;

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

    Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            call_generator_api,
            cancel_generator_api,
            call_circuit_converter_api,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
