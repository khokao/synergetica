use crate::schemas::{GeneratorResponseData,ConverterResponseData};
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


    pub async fn send_request_circuit_converter(flow_json:String) -> Result<reqwest::Response, reqwest::Error> {
        let client = reqwest::Client::new();
        client
            .post("http://127.0.0.1:8000/convert-gui-circuit")
            .json(&json!({
                "flow_data_json_str":flow_json
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

    pub async fn parse_response_circuit_converter(response: reqwest::Response) -> Result<ConverterResponseData, String> {
        match response.json::<ConverterResponseData>().await {
            Ok(data) => Ok(data),
            Err(e) => Err(format!("Failed to parse response from circuit converter: {}", e)),
        }
    }
}
