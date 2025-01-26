from typing import Literal

from pydantic import BaseModel, Field


class ControlByItemParams(BaseModel):
    Ymin: float
    Ymax: float
    K: float
    n: float


class ControlByItem(BaseModel):
    name: str
    type: Literal['Repression', 'Activation']
    params: ControlByItemParams


class PromoterParams(BaseModel):
    Ydef: float


class PromoterData(BaseModel):
    name: str
    category: Literal['Promoter']
    sequence: str
    controlBy: list[ControlByItem]
    params: PromoterParams


class ProteinParams(BaseModel):
    Dp: float
    TIRb: float


class ProteinData(BaseModel):
    name: str
    category: Literal['Protein']
    sequence: str
    controlBy: list = Field(max_length=0)
    params: ProteinParams


class TerminatorData(BaseModel):
    name: str
    category: Literal['Terminator']
    sequence: str
    controlBy: list = Field(max_length=0)
    params: dict = Field(max_length=0)


class ReactFlowParentNode(BaseModel):
    id: str
    type: Literal['parent']
    data: dict = Field(max_length=0)


class ReactFlowChildNode(BaseModel):
    id: str
    type: Literal['child']
    data: ProteinData | PromoterData | TerminatorData
    parentId: str


class ReactFlowConnectionEdge(BaseModel):
    type: Literal['connection']
    source: str
    target: str


class ReactFlowAnnotationEdge(BaseModel):
    type: Literal['annotation']
    source: str
    target: str


class ReactFlowObject(BaseModel):
    nodes: list[ReactFlowParentNode | ReactFlowChildNode]
    edges: list[ReactFlowConnectionEdge | ReactFlowAnnotationEdge]
