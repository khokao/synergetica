from pydantic import BaseModel


class GUINode(BaseModel):
    id: str
    nodeCategory: str
    nodeSubcategory: str
    nodePartsName: str
    sequence: str
    controlTo: dict[str, dict[str, str]]
    controlBy: dict[str, dict[str, str]]
    meta: dict[str, float]
