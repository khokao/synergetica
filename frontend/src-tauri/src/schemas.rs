use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct GeneratorResponseData {
    pub rbs_sequence: String,
    pub promoter_sequence: String,
}

#[derive(Serialize, Deserialize)]
pub struct SimulatorResponseData {
    pub data1: Vec<f64>,
    pub data2: Vec<f64>,
    pub time: Vec<f64>,
}
