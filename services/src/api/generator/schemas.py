from typing import Annotated

from pydantic import BaseModel, Field, PositiveFloat, StringConstraints

DNASequence = Annotated[str, StringConstraints(pattern=r'^[ATGC]+$')]


class GeneratorInput(BaseModel):
    protein_target_values: dict[str, PositiveFloat] = Field(min_length=1)


class GeneratorOutput(BaseModel):
    protein_generated_sequences: dict[str, DNASequence] = Field(min_length=1)
