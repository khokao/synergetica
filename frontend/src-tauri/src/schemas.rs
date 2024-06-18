use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct GeneratorResponseData {
    pub rbs_sequence: String,
    pub promoter_sequence: String,
}
