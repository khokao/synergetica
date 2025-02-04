from fastapi import APIRouter

from .schemas import GeneratorInput, GeneratorOutput
from .service import generate_sequences

router = APIRouter()


@router.post('/generate', response_model=GeneratorOutput)
async def generate(input: GeneratorInput) -> GeneratorOutput:
    protein_generated_sequences = await generate_sequences(
        protein_target_values=input.protein_target_values,
    )
    return GeneratorOutput(protein_generated_sequences=protein_generated_sequences)
