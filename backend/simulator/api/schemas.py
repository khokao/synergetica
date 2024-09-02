from pydantic import BaseModel, Field


class SimulatorInput(BaseModel):
    param1: float = Field(1.0, description='Parameter 1')
    param2: float = Field(1.0, description='Parameter 2')


class SimulatorOutput(BaseModel):
    data1: list[float]
    data2: list[float]
    time: list[float]


class ConverterInput(BaseModel):
    flow_data_json_str: str


class ConverterOutput(BaseModel):
    num_protein: int
    proteins: list[str]
    function_str: str
