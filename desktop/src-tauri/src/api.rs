use anyhow::{Context, Result};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::collections::HashMap;

pub struct APIClient;

impl APIClient {
    pub async fn generate(
        protein_target_values: HashMap<String, f64>,
        protein_init_sequences: HashMap<String, String>,
    ) -> Result<GeneratorResponseData> {
        let client = Client::new();
        let response = client
            .post("http://127.0.0.1:8000/generate")
            .json(&json!({
                "protein_target_values": protein_target_values,
                "protein_init_sequences": protein_init_sequences
            }))
            .send()
            .await
            .context("Failed to send request to generator API")?;

        Self::handle_response::<GeneratorResponseData>(response).await
    }

    async fn handle_response<T: for<'de> Deserialize<'de>>(response: reqwest::Response) -> Result<T> {
        if response.status().is_success() {
            let data = response.json::<T>().await.context("Failed to parse response")?;
            Ok(data)
        } else {
            Err(anyhow::anyhow!(
                "Received non-success status code: {}",
                response.status()
            ))
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneratorResponseData {
    pub protein_generated_sequences: HashMap<String, String>,
}
