#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod clients;
mod errors;
mod schemas;

use clients::APIClient;
use errors::{handle_request_error, handle_response_error};
use tauri::Builder;
use schemas::GeneratorResponseData;

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

#[tokio::main]
async fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![call_generator_api])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
