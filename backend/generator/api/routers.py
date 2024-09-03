import asyncio

from fastapi import APIRouter, HTTPException
from huggingface_hub import hf_hub_download
from loguru import logger

from ..core.genetic_algorithm import async_generate_rbs
from .schemas import GeneratorInput, GeneratorOutput

router = APIRouter()


@router.post('/generate', response_model=GeneratorOutput)
async def generate_sequences(input: GeneratorInput) -> GeneratorOutput:
    logger.info(f'Generating sequences with input: {input.model_dump_json()}')

    try:
        predictor_ckpt_path = await asyncio.to_thread(
            hf_hub_download,
            repo_id='gene-circuit-ide/rbs-predictor',
            filename='v1.ckpt',
        )

        # Run with dummy inputs.
        rbs_sequences, rbs_rescaled_predictions = await async_generate_rbs(
            predictor_ckpt_path=predictor_ckpt_path,
            target_value=399228.4223,
            num_iterations=2,
        )
        logger.info(f'Generated sequences: {rbs_sequences}')
        logger.info(f'Generated rescaled predictions: {rbs_rescaled_predictions}')
        return GeneratorOutput(  # Dummy code. (TODO: Replace)
            group_node_details={
                'foobar-group-id-0': [
                    {'node_category': 'protein', 'sequence': 'ATCG'},
                ],
                'foobar-group-id-1': [
                    {'node_category': 'protein', 'sequence': 'ATCG'},
                ],
            }
        )

    except asyncio.CancelledError as e:
        logger.error('The task was cancelled due to a client disconnect.')
        raise HTTPException(status_code=499, detail='Request cancelled') from e

    except Exception as e:
        logger.error(f'Error during sequence generation: {str(e)}')
        raise HTTPException(status_code=500, detail='Internal server error') from e
