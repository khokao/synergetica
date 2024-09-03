use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct ChildNodesDetails {
    pub node_category: String,
    pub sequence: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneratorResponseData {
    pub group_node_details: HashMap<String, Vec<ChildNodesDetails>>,
}

#[derive(Serialize, Deserialize)]
pub struct SimulatorResponseData {
    pub data1: Vec<f64>,
    pub data2: Vec<f64>,
    pub time: Vec<f64>,
}
