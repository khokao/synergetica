from fastapi import APIRouter
from loguru import logger

from .schemas import GeneratorInput, GeneratorOutput

router = APIRouter()


@router.post('/generate', response_model=GeneratorOutput)
async def generate_sequences(input: GeneratorInput) -> GeneratorOutput:
    logger.info(f'Generating sequences with input: {input.model_dump_json()}')
    return GeneratorOutput(rbs_sequence='ATGC', promoter_sequence='ATGC')  # Dummy code. (TODO: Replace)
