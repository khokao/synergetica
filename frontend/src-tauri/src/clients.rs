use crate::schemas::{GeneratorResponseData,ConverterResponseData};
use reqwest;
use serde_json::json;

pub struct APIClient;

impl APIClient {
    pub async fn send_request(
        rbs_parameter: f64,
        rbs_upstream: String,
        rbs_downstream: String,
        promoter_parameter: f64,
        promoter_upstream: String,
    ) -> Result<reqwest::Response, reqwest::Error> {
        let client = reqwest::Client::new();
        client
            .post("http://127.0.0.1:8000/generate")
            .json(&json!({
                "rbs_parameter": rbs_parameter,
                "rbs_upstream": rbs_upstream,
                "rbs_downstream": rbs_downstream,
                "promoter_parameter": promoter_parameter,
                "promoter_upstream": promoter_upstream,
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
