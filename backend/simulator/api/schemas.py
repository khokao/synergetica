from typing import Dict, List

from pydantic import BaseModel


class SimulatorInput(BaseModel):
    graph: Dict[str, List[int]]


class SimulatorOutput(BaseModel):
    parameters: List[float]
