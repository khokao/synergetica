pub fn handle_request_error(e: reqwest::Error) -> String {
    format!("Failed to call generator API: {}", e)
}

pub fn handle_response_error(status: reqwest::StatusCode) -> String {
    format!("Received non-success status code: {}", status)
}
