use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct GeneratorResponseData {
    pub rbs_sequence: String,
    pub promoter_sequence: String,
}

#[derive(Serialize,Deserialize)]
pub struct ConverterResponseData {
    pub num_protein: i32,
    pub proteins: Vec<String>,
    pub function_str: String,
}
