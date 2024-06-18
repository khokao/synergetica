use crate::schemas::GeneratorResponseData;
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

    pub async fn parse_response(response: reqwest::Response) -> Result<GeneratorResponseData, String> {
        match response.json::<GeneratorResponseData>().await {
            Ok(data) => Ok(data),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        }
    }
}
