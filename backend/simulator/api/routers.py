import json
from typing import Callable

import numpy as np
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from loguru import logger

from ..modules.build_protein_interaction import (
    build_protein_interact_graph,
    create_adjacency_matrix,
    extract_promoter_controlling_proteins,
    search_all_connected_components,
)
from ..modules.dynamic_formulation import build_function_as_str
from ..modules.euler import solve_ode_with_euler
from ..modules.utils import get_node_id2data, get_parts_id2node_ids, get_specific_category_node_ids
from .schemas import ConverterInput, ConverterOutput, ReactFlowObject
from .utils import get_protein_id2parts_name

router = APIRouter()


@router.post('/convert-gui-circuit', response_model=ConverterOutput)
async def convert_gui_circuit(data: ConverterInput) -> ConverterOutput:
    reactflow_data = json.loads(data.reactflow_object_json_str)
    reactflow_object = ReactFlowObject(**reactflow_data)

    node_id2idx = {node.id: idx for idx, node in enumerate(reactflow_object.nodes)}
    adjacency_matrix = create_adjacency_matrix(edges=reactflow_object.edges, node_id2idx=node_id2idx)
    all_connected_components = search_all_connected_components(adjacency_matrix=adjacency_matrix)

    node_idx2id = {idx: node.id for idx, node in enumerate(reactflow_object.nodes)}
    node_idx2category = {idx: node.data.nodeCategory for idx, node in enumerate(reactflow_object.nodes)}
    promoter_controlling_proteins = extract_promoter_controlling_proteins(
        all_connected_components=all_connected_components,
        node_idx2category=node_idx2category,
        node_idx2id=node_idx2id,
    )

    parts_id2node_ids = get_parts_id2node_ids(reactflow_object.nodes)
    node_id2data = get_node_id2data(reactflow_object.nodes)
    protein_node_ids = get_specific_category_node_ids(reactflow_object.nodes, node_category='protein')
    protein_interact_graph = build_protein_interact_graph(
        promoter_controlling_proteins=promoter_controlling_proteins,
        parts_id2node_ids=parts_id2node_ids,
        node_id2data=node_id2data,
        protein_node_ids=protein_node_ids,
    )
    function_str = build_function_as_str(protein_interact_graph, protein_node_ids, node_id2data)

    protein_id2display_name = get_protein_id2parts_name(protein_node_ids=protein_node_ids, node_id2data=node_id2data)

    return ConverterOutput(protein_id2name=protein_id2display_name, function_str=function_str, valid=True)


@router.websocket('/ws/simulation')
async def simulation(websocket: WebSocket) -> None:
    functions: dict[str, Callable[..., tuple[float, ...]]] = {}
    logger.info('Client connected')
    await websocket.accept()
    try:
        while True:  # Perpetuating the connection
            raw_string_data = await websocket.receive_text()
            data = json.loads(raw_string_data)
            logger.info(f'Received data: {data.keys()}')
            if 'function_str' in data:  # defining simulation function.
                function_str = data.get('function_str', None)
                exec(function_str, globals(), functions)
                function_name = function_str.split(' ')[1].split('(')[0]
                times = np.arange(0, 300, 1, dtype=np.float64)
                var_init = [0.0] * (len(data['protein_id2name'].keys()) * 2)
                logger.info(f'Function {function_name} defined.')
                await websocket.send_text(f"Function '{function_name}' defined.")
            else:  # solving ODE with the given parameters.
                try:
                    params = data['params']  # params = dict['params':list[float]]
                    solution = solve_ode_with_euler(
                        functions[function_name], times=times, var_init=var_init, args=tuple(params)
                    )
                    logger.info(f'Solution: {solution[:5]}')
                    response_data = json.dumps(solution.tolist())
                    await websocket.send_text(response_data)
                except Exception as e:  # When an error occurs
                    logger.error(f'Error processing parameters: {e}')
                    await websocket.send_text(f'Error: {str(e)}')

    except WebSocketDisconnect:  # When the client disconnects
        logger.info('Client disconnected')
