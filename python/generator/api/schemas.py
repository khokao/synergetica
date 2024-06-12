from pydantic import BaseModel, field_validator


class GeneratorInput(BaseModel):
    parameter: float


class GeneratorOutput(BaseModel):
    sequence: str

    @field_validator('sequence')
    @classmethod
    def validate_sequence(cls, v: str) -> str:
        valid_nucleotides = {'A', 'T', 'G', 'C'}
        if not all(char in valid_nucleotides for char in v):
            raise ValueError('DNA sequence must contain only A, T, G, and C')
        return v
