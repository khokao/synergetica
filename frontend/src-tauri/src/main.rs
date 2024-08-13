#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod clients;
mod errors;
mod schemas;

use clients::APIClient;
use errors::{handle_request_error, handle_response_error};
use schemas::{GeneratorResponseData, SimulatorResponseData,ConverterResponseData};
use serde::Serialize;
use std::fs;
use std::path::Path;
use tauri::Builder;

#[tauri::command]
async fn call_generator_api(
    rbs_parameter: f64,
    rbs_upstream: String,
    rbs_downstream: String,
    promoter_parameter: f64,
    promoter_upstream: String,
) -> Result<GeneratorResponseData, String> {
    let response = APIClient::send_request(
        rbs_parameter,
        rbs_upstream,
        rbs_downstream,
        promoter_parameter,
        promoter_upstream,
    )
    .await;

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
async fn call_simulator_api(param1: f64, param2: f64) -> Result<SimulatorResponseData, String> {
    let response = APIClient::send_request_simulation(param1, param2).await;

    match response {
        Ok(resp) => {
            if resp.status().is_success() {
                APIClient::parse_response_simulator(resp).await
            } else {
                Err(handle_response_error(resp.status()))
            }
        }
        Err(e) => Err(handle_request_error(e)),
    }
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

#[tauri::command]
async fn call_backend_state_api() -> Result<ConverterResponseData,String>{
    let response = APIClient::send_request_backend_state().await;

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
    Builder::default()
        .invoke_handler(tauri::generate_handler![
            call_generator_api,
            call_simulator_api,
            call_circuit_converter_api,
            call_backend_state_api,
            read_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
