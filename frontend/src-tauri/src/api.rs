use anyhow::{Context, Result};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::collections::HashMap;

pub struct APIClient;

impl APIClient {
    pub async fn generate(
        reactflow_object_json_str: String,
        rbs_target_parameters: HashMap<String, f64>,
    ) -> Result<GeneratorResponseData> {
        let client = Client::new();
        let response = client
            .post("http://127.0.0.1:8080/generate")
            .json(&json!({
                "reactflow_object_json_str": reactflow_object_json_str,
                "rbs_target_parameters": rbs_target_parameters
            }))
            .send()
            .await
            .context("Failed to send request to generator API")?;

        Self::handle_response::<GeneratorResponseData>(response).await
    }

    pub async fn convert_circuit(reactflow_object_json_str: String) -> Result<ConverterResponseData> {
        let client = Client::new();
        let response = client
            .post("http://127.0.0.1:8000/convert-gui-circuit")
            .json(&json!({
                "reactflow_object_json_str": reactflow_object_json_str
            }))
            .send()
            .await
            .context("Failed to send request to circuit converter API")?;

        Self::handle_response::<ConverterResponseData>(response).await
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
pub struct ChildNodesDetails {
    pub node_category: String,
    pub sequence: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneratorResponseData {
    pub parent2child_details: HashMap<String, Vec<ChildNodesDetails>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ConverterResponseData {
    pub protein_id2name: HashMap<String, String>,
    pub function_str: String,
}
