from pydantic import BaseModel, field_validator


class ReactFlowNodeData(BaseModel):
    nodeCategory: str | None = None  # Parent node does not have this key.
    sequence: str | None = None  # Parent node does not have this key.


class ReactFlowNodePosition(BaseModel):
    x: float
    y: float


class ReactFlowNode(BaseModel):
    id: str
    type: str
    position: ReactFlowNodePosition
    data: ReactFlowNodeData
    parentId: str | None = None  # Parent node does not have this key.


class ReactFlowObject(BaseModel):
    nodes: list[ReactFlowNode]


class GeneratorInput(BaseModel):
    reactflow_object_json_str: str
    rbs_target_parameters: dict[str, float]


class OutputChildNodeDetails(BaseModel):
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
    parent2child_details: dict[str, list[OutputChildNodeDetails]]
