use crate::schemas::{GeneratorResponseData, SimulatorResponseData};
use reqwest;
use serde_json::json;
use std::collections::HashMap;

pub struct APIClient;

impl APIClient {
    pub async fn send_request_generation(
        reactflow_object_json_str: String,
        rbs_target_parameters: HashMap<String, f64>,
    ) -> Result<reqwest::Response, reqwest::Error> {
        let client = reqwest::Client::new();
        client
            .post("http://127.0.0.1:8000/generate")
            .json(&json!({
                "reactflow_object_json_str": reactflow_object_json_str,
                "rbs_target_parameters": rbs_target_parameters
            }))
            .send()
            .await
    }

    pub async fn send_request_simulation(param1: f64, param2: f64) -> Result<reqwest::Response, reqwest::Error> {
        let client = reqwest::Client::new();
        client
            .post("http://127.0.0.1:8000/simulate-with-euler")
            .query(&json!({
                "param1":param1,
                "param2":param2
            }))
            .send()
            .await
    }

    pub async fn parse_response(response: reqwest::Response) -> Result<GeneratorResponseData, String> {
        match response.json::<GeneratorResponseData>().await {
            Ok(data) => Ok(data),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        }
    }

    pub async fn parse_response_simulator(response: reqwest::Response) -> Result<SimulatorResponseData, String> {
        match response.json::<SimulatorResponseData>().await {
            Ok(data) => Ok(data),
            Err(e) => Err(format!("Failed to parse response sim: {}", e)),
        }
    }
}
