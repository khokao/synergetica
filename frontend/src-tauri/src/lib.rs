mod api;

use api::{APIClient, ConverterResponseData, GeneratorResponseData};
use std::collections::HashMap;
use std::sync::Arc;
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
    let cancellation_token = CancellationToken::new();

    {
        let mut state = state.lock().await;
        state.cancellation_token = cancellation_token.clone();
    }

    let api_call = APIClient::generate(reactflow_object_json_str, rbs_target_parameters);

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

#[tauri::command]
async fn call_circuit_converter_api(reactflow_object_json_str: String) -> Result<ConverterResponseData, String> {
    APIClient::convert_circuit(reactflow_object_json_str)
        .await
        .map_err(|e| e.to_string())
}

pub fn run() {
    let state = Arc::new(Mutex::new(AppState {
        cancellation_token: CancellationToken::new(),
    }));

    tauri::Builder::default()
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
