import asyncio
import json
from http import HTTPStatus
from operator import itemgetter

from aiomultiprocess import Pool
from fastapi import APIRouter, HTTPException
from huggingface_hub import hf_hub_download
from loguru import logger

from api.schemas.generator import (
    GeneratorInput,
    GeneratorOutput,
    OutputChildNodeDetails,
    ReactFlowNode,
    ReactFlowObject,
)
from generator.genetic_algorithm.generate import async_generate_rbs

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


def create_parent2child_details(
    all_ga_outputs: dict[str, dict[str, list[str] | list[float]]],
    nodes: list[ReactFlowNode],
) -> dict[str, list[OutputChildNodeDetails]]:
    parent2ordered_children = get_parent2ordered_children(nodes=nodes)
    child_id2category = get_child_id2key(nodes=nodes, key='category')
    child_id2sequence = get_child_id2key(nodes=nodes, key='sequence')

    parent2child_details = {}  # type: dict[str, list[OutputChildNodeDetails]]
    for parent_id, child_ids in parent2ordered_children.items():
        parent2child_details[parent_id] = []
        for child_id in child_ids:
            if child_id in all_ga_outputs.keys():
                details = OutputChildNodeDetails(
                    **{
                        'node_category': 'rbs',
                        'sequence': str(all_ga_outputs[child_id]['sequences'][0]).upper(),
                    }
                )
                parent2child_details[parent_id].append(details)

            details = OutputChildNodeDetails(
                **{
                    'node_category': child_id2category[child_id],
                    'sequence': child_id2sequence[child_id].upper(),
                }
            )
            parent2child_details[parent_id].append(details)

    return parent2child_details


def get_parent2ordered_children(nodes: list[ReactFlowNode]) -> dict[str, list[str]]:
    """
    Args:
        nodes (list[ReactFlowNode]): List of ReactFlowNode objects.

    Returns:
        dict[str, list[str]]: Dictionary mapping parent node IDs to a list of ordered child node IDs.
    """
    parent_position_pairs = sorted(
        [(node.id, node.position.y) for node in nodes if node.type == 'parent'], key=itemgetter(1)
    )

    parent2child_position_pairs = {parent_id: [] for parent_id, _ in parent_position_pairs}  # type: ignore
    for node in nodes:
        if node.type == 'child' and node.parentId is not None:
            parent2child_position_pairs[node.parentId].append((node.id, node.position.x))

    parent2ordered_children = {}
    for parent_id, child_position_pairs in parent2child_position_pairs.items():
        child_position_pairs = sorted(child_position_pairs, key=itemgetter(1))
        parent2ordered_children[parent_id] = [child_id for child_id, _ in child_position_pairs]

    return parent2ordered_children


def get_child_id2key(nodes: list[ReactFlowNode], key: str) -> dict[str, str]:
    child_id2key = {node.id: getattr(node.data, key) for node in nodes if node.type == 'child'}
    return child_id2key
