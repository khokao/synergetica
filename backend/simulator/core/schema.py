from pydantic import BaseModel


class GUINode(BaseModel):
    id: str
    nodeCategory: str
    nodeSubcategory: str
    nodePartsName: str
    sequence: str
    controlTo: list[dict[str, str]] | None
    controlBy: list[dict[str, str]] | None
    meta: dict[str, float] | None
