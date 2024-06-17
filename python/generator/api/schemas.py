from pydantic import BaseModel, field_validator


class GeneratorInput(BaseModel):
    rbs_parameter: float
    rbs_upstream: str
    rbs_downstream: str
    promoter_parameter: float
    promoter_upstream: str


class GeneratorOutput(BaseModel):
    rbs_sequence: str
    promoter_sequence: str

    @field_validator('rbs_sequence', 'promoter_sequence')
    @classmethod
    def validate_sequence(cls, v: str) -> str:
        valid_nucleotides = {'A', 'T', 'G', 'C'}
        if not all(char in valid_nucleotides for char in v):
            raise ValueError('DNA sequence must contain only A, T, G, and C')
        return v
