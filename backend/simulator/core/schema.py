from pydantic import BaseModel


class GUINode(BaseModel):
    id: str
    nodeCategory: str
    nodeSubcategory: str
    nodePartsName: str
    sequence: str
    controlTo: dict | None
    controlBy: dict | None
    meta: dict | None
