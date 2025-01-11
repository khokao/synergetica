use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthcheckResponse {
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneratorResponseData {
    pub protein_generated_sequences: HashMap<String, String>,
}

#[derive(Debug, Serialize)]
struct GenerateRequestData {
    protein_target_values: HashMap<String, f64>,
    protein_init_sequences: HashMap<String, String>,
}

pub struct APIClient;

impl APIClient {
    pub async fn healthcheck() -> Result<(), String> {
        let client = Client::new();
        let response = client
            .get("http://127.0.0.1:7007/healthcheck")
            .send()
            .await
            .map_err(|e| format!("Failed to send request: {}", e))?;

        if response.status().is_success() {
            Ok(())
        } else {
            Err(format!("Received non-success status code: {}", response.status()))
        }
    }

    pub async fn generate(
        protein_target_values: HashMap<String, f64>,
        protein_init_sequences: HashMap<String, String>,
    ) -> Result<GeneratorResponseData, String> {
        let request_data = GenerateRequestData {
            protein_target_values,
            protein_init_sequences,
        };

        let client = Client::new();
        let response = client
            .post("http://127.0.0.1:7007/generate")
            .json(&request_data)
            .send()
            .await
            .map_err(|e| format!("Failed to send request: {}", e))?;

        if response.status().is_success() {
            let data = response
                .json::<GeneratorResponseData>()
                .await
                .map_err(|e| format!("Failed to parse response: {}", e))?;
            Ok(data)
        } else {
            Err(format!("Received non-success status code: {}", response.status()))
        }
    }
}
