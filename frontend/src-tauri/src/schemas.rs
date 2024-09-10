use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct ChildNodesDetails {
    pub node_category: String,
    pub sequence: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneratorResponseData {
    pub parent2child_details: HashMap<String, Vec<ChildNodesDetails>>,
}

#[derive(Serialize,Deserialize)]
pub struct ConverterResponseData {
    pub num_protein: i32,
    pub proteins: HashMap<String, String>,
    pub function_str: String,
}
