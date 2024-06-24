from pydantic import BaseModel, field_validator
from typing import List,Dict

class SimulatorInput(BaseModel):
    graph: Dict[str,List[int]]


class SimulatorOutput(BaseModel):
    parameters: List[float]

    
