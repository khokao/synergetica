from typing import Any

from pydantic import BaseModel


class SimulatorInput(BaseModel):
    circuit_graph: Any


class SimulatorOutput(BaseModel):
    parameter: float

    @classmethod
    def validate_parameter(cls, v: float) -> float:
        if v < 0:
            raise ValueError('Parameter must be non-negative')
        return v
