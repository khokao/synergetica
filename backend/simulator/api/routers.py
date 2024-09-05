import json
from typing import Callable

import numpy as np
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from loguru import logger
from omegaconf import OmegaConf

from simulator.modules.build_protein_interaction import get_protein_nameId_dict, run_convert
from simulator.modules.dynamic_formulation import build_function_as_str
from simulator.modules.euler import solve_ode_with_euler

from .schemas import ConverterInput, ConverterOutput

router = APIRouter()


@router.post('/convert-gui-circuit', response_model=ConverterOutput)
async def convert_gui_circuit(data: ConverterInput) -> ConverterOutput:
    raw_circuit_data: dict = json.loads(data.flow_data_json_str)
    circuit = OmegaConf.create(raw_circuit_data)
    protein_interact_graph, proteinId_list, all_nodes = run_convert(circuit)
    num_protein = len(proteinId_list)
    protein_nameId_dict = get_protein_nameId_dict(proteinId_list, all_nodes)
    function_str = build_function_as_str(protein_interact_graph, proteinId_list, all_nodes)
    logger.info(f'defined function: {function_str}')
    return ConverterOutput(num_protein=num_protein, proteins=protein_nameId_dict, function_str=function_str)


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
                times = np.arange(0, 300, 1)
                var_init = [0.0] * (data['num_protein'] * 2)
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
