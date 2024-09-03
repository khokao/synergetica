from typing import Literal

from pydantic import BaseModel


class GUINode(BaseModel):
    id: str
    nodeCategory: Literal['protein', 'promoter', 'terminator']
    nodeSubcategory: Literal['RepressorProtein', 'RepressivePromoter', 'StandardTerminator']
    nodePartsName: str
    sequence: str
    partsId: str
    controlTo: list[dict[str, str]] | None
    controlBy: list[dict[str, str]] | None
    meta: dict[str, float] | None
