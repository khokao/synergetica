import json

from pydantic import BaseModel, ValidationError, ValidationInfo, field_validator


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

    @field_validator('reactflow_object_json_str')
    @classmethod
    def validate_reactflow_object_json_str(cls, v: str) -> str:
        if not v:
            raise ValueError('reactflow_object_json_str cannot be empty')
        try:
            json_data = json.loads(v)
            ReactFlowObject(**json_data)
        except json.JSONDecodeError as e:
            raise ValueError('Invalid JSON in reactflow_object_json_str') from e
        except ValidationError as e:
            raise ValueError('reactflow_object_json_str does not match expected schema') from e
        return v

    @field_validator('rbs_target_parameters')
    @classmethod
    def validate_rbs_target_parameters(cls, v: dict[str, float], info: ValidationInfo) -> dict[str, float]:
        if not v:
            raise ValueError('rbs_target_parameters cannot be empty')

        reactflow_json_str = info.data.get('reactflow_object_json_str')
        if reactflow_json_str:
            reactflow_data = json.loads(reactflow_json_str)
            reactflow_object = ReactFlowObject(**reactflow_data)
            node_ids = {node.id for node in reactflow_object.nodes}
            missing_ids = [protein_id for protein_id in v.keys() if protein_id not in node_ids]
            if missing_ids:
                raise ValueError(f'The following protein ids are not present in reactflow_object.nodes: {missing_ids}')
        return v


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
