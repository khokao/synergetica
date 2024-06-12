from fastapi import APIRouter
from loguru import logger

from .schemas import GeneratorInput, GeneratorOutput

router = APIRouter()


@router.post('/generate-rbs', response_model=GeneratorOutput)
async def generate_rbs_sequence(input: GeneratorInput) -> GeneratorOutput:
    logger.info(f'Generating RBS sequence with parameter: {input.parameter}')
    return GeneratorOutput(sequence='ATGC')  # Dummy code. (TODO: Replace with actual implementation)


@router.post('/generate-promoter', response_model=GeneratorOutput)
async def generate_promoter_sequence(input: GeneratorInput) -> GeneratorOutput:
    logger.info(f'Generating promoter sequence with parameter: {input.parameter}')
    return GeneratorOutput(sequence='ATGC')  # Dummy code. (TODO: Replace with actual implementation)
