import asyncio
import json

from fastapi import APIRouter, HTTPException
from huggingface_hub import hf_hub_download
from loguru import logger

from ..core.genetic_algorithm import async_generate_rbs
from .schemas import GeneratorInput, GeneratorOutput, ReactFlowObject
from .utils import create_parent2child_details

router = APIRouter()


@router.post('/generate', response_model=GeneratorOutput)
async def generate_sequences(input: GeneratorInput) -> GeneratorOutput:
    reactflow_object = ReactFlowObject(**json.loads(input.reactflow_object_json_str))

    logger.info('Generating sequences...')
    try:
        predictor_ckpt_path = await asyncio.to_thread(
            hf_hub_download,
            repo_id='gene-circuit-ide/rbs-predictor',
            filename='v1.ckpt',
        )

        all_ga_outputs = {}
        for protein_id, target_value in input.rbs_target_parameters.items():
            rbs_result = await async_generate_rbs(
                predictor_ckpt_path=predictor_ckpt_path,
                target_value=target_value,
                num_iterations=2,
            )
            all_ga_outputs[protein_id] = rbs_result

        parent2child_details = create_parent2child_details(all_ga_outputs, reactflow_object.nodes)

        return GeneratorOutput(parent2child_details=parent2child_details)

    except asyncio.CancelledError as e:
        logger.error('The task was cancelled due to a client disconnect.')
        raise HTTPException(status_code=499, detail='Request cancelled') from e

    except Exception as e:
        logger.error(f'Error during sequence generation: {str(e)}')
        raise HTTPException(status_code=500, detail='Internal server error') from e
