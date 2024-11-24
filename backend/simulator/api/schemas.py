from typing import Literal

from pydantic import BaseModel, Field, field_validator


class SimulatorInput(BaseModel):
    param1: float = Field(1.0, description='Parameter 1')
    param2: float = Field(1.0, description='Parameter 2')


class SimulatorOutput(BaseModel):
    data1: list[float]
    data2: list[float]
    time: list[float]


class ConverterInput(BaseModel):
    reactflow_object_json_str: str


class ConverterOutput(BaseModel):
    protein_id2name: dict[str, str]
    function_str: str


class ReactFlowChildNodeControlItem(BaseModel):
    name: str
    type: Literal['repression', 'activation']


class ReactFlowChildNodeData(BaseModel):
    name: str
    category: Literal['protein', 'promoter', 'terminator']
    sequence: str
    controlTo: list[ReactFlowChildNodeControlItem]
    controlBy: list[ReactFlowChildNodeControlItem]
    meta: dict[str, float] | None


class ReactFlowChildNode(BaseModel):
    id: str
    data: ReactFlowChildNodeData


class ReactFlowEdge(BaseModel):
    source: str
    target: str


class ReactFlowObject(BaseModel):
    nodes: list[ReactFlowChildNode]
    edges: list[ReactFlowEdge]

    @field_validator('nodes', mode='before')
    @classmethod
    def filter_nodes(cls, v: list) -> list:
        if not isinstance(v, list):
            raise ValueError('Nodes should be a list')
        child_nodes = [n for n in v if n['type'] == 'child']
        return child_nodes

    @field_validator('edges', mode='before')
    @classmethod
    def filter_edges(cls, v: list) -> list:
        if not isinstance(v, list):
            raise ValueError('Edges should be a list')
        custom_edges = [e for e in v if e['type'] == 'custom']
        return custom_edges
