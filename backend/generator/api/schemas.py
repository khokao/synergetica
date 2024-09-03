from pydantic import BaseModel, field_validator


class GeneratorInput(BaseModel):
    reactflow_object_json_str: str
    rbs_target_parameters: dict[str, float]


class ChildNodesDetails(BaseModel):
    node_category: str  # Used to display the colored sequence in the frontend ?
    sequence: str

    @field_validator('sequence')
    @classmethod
    def validate_sequence(cls, v: str) -> str:
        valid_nucleotides = {'A', 'T', 'G', 'C'}
        if not all(char in valid_nucleotides for char in v):
            raise ValueError('DNA sequence must contain only A, T, G, and C')
        return v


class GeneratorOutput(BaseModel):
    group_node_details: dict[str, list[ChildNodesDetails]]
