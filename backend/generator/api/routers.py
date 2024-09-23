import asyncio
import json
from http import HTTPStatus

from aiomultiprocess import Pool
from fastapi import APIRouter, HTTPException
from huggingface_hub import hf_hub_download
from loguru import logger

from ..core.genetic_algorithm import async_generate_rbs
from .schemas import GeneratorInput, GeneratorOutput, ReactFlowObject
from .utils import create_parent2child_details

router = APIRouter()


async def async_generate_rbs_with_id(
    protein_id: str,
    target_value: float,
    predictor_ckpt_path: str,
) -> tuple:
    result = await async_generate_rbs(
        predictor_ckpt_path=predictor_ckpt_path,
        target_value=target_value,
    )
    return protein_id, result


@router.post('/generate', response_model=GeneratorOutput)
async def generate_sequences(input: GeneratorInput) -> GeneratorOutput:
    reactflow_data = json.loads(input.reactflow_object_json_str)
    reactflow_object = ReactFlowObject(**reactflow_data)

    logger.info('Downloading predictor checkpoint...')
    try:
        predictor_ckpt_path = hf_hub_download(repo_id='gene-circuit-ide/rbs-predictor', filename='v1.ckpt')
    except Exception as e:
        logger.error(f'Error downloading predictor checkpoint: {str(e)}')
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail='Failed to download predictor checkpoint'
        ) from e

    logger.info('Generating sequences...')
    try:
        async with Pool() as pool:
            tasks = [
                pool.apply(async_generate_rbs_with_id, args=(protein_id, target_value, predictor_ckpt_path))
                for protein_id, target_value in input.rbs_target_parameters.items()
            ]
            results = await asyncio.gather(*tasks)
        logger.info('Generation complete.')

        logger.info('Creating response...')
        all_ga_outputs = dict(results)
        parent2child_details = create_parent2child_details(all_ga_outputs, reactflow_object.nodes)

        return GeneratorOutput(parent2child_details=parent2child_details)
    except asyncio.CancelledError as e:
        logger.error('The task was canceled due to a client disconnect.')
        raise HTTPException(status_code=499, detail='Request canceled') from e
    except Exception as e:
        logger.error(f'Error during sequence generation: {str(e)}')
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail='Internal server error') from e
