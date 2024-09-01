from pydantic import BaseModel, Field, root_validator


class SimulatorInput(BaseModel):
    param1: float = Field(1.0, description='Parameter 1')
    param2: float = Field(1.0, description='Parameter 2')


class SimulatorOutput(BaseModel):
    data1: list[float]
    data2: list[float]
    time: list[float]


class ConverterInput(BaseModel):
    flow_data_json: str


class ConverterOutput(BaseModel):
    num_protein: int
    proteins: list[str]
    function_str: str

    @root_validator(pre=True)
    def check_function_str(cls, values):
        function_str = values.get('function_str', '')
        if not function_str.startswith('def '):
            raise ValueError("function_str must start with 'def '.")
        return values
