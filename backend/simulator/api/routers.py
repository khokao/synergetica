import json

import numpy as np
from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
from loguru import logger
from omegaconf import OmegaConf

from simulator.modules.build_protein_interaction import get_parts_name_list, run_convert
from simulator.modules.dynamic_formulation import build_function_as_str
from simulator.modules.euler import run_euler_example, solve_ode_with_euler

from .schemas import ConverterOutput, SimulatorOutput

router = APIRouter()


@router.post('/simulate-with-euler', response_model=SimulatorOutput)
async def get_data_param(param1: float = Query(1.0), param2: float = Query(1.0)) -> SimulatorOutput:
    logger.info(f'Simulating with parameters: {param1}, {param2}')
    solution = run_euler_example(alpha1=param1, alpha2=param2)
    time = np.arange(0, len(solution)).tolist()
    return SimulatorOutput(data1=solution[:, 0].tolist(), data2=solution[:, 1].tolist(), time=time)


@router.post('/convert-gui-circuit', response_model=ConverterOutput)
async def convert_gui_circuit(flow_data_json: str) -> ConverterOutput:
    raw_circuit_data: dict = json.loads(flow_data_json)
    circuit = OmegaConf.create(raw_circuit_data)
    protein_interact_graph, proteinId_idx_bidict, all_nodes = run_convert(circuit)
    num_protein = len(proteinId_idx_bidict)
    protein_names = get_parts_name_list(proteinId_idx_bidict, all_nodes)
    function_str = build_function_as_str(protein_interact_graph, proteinId_idx_bidict, all_nodes)
    logger.info(f'defined function: {function_str}')
    return ConverterOutput(num_protein=num_protein, proteins=protein_names, function_str=function_str)


functions = {}


@router.websocket('/ws/simulation')
async def simulation(websocket: WebSocket):
    logger.info('Client connected')
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            if data.startswith('def '):
                exec(data, globals(), functions)
                function_name = data.split(' ')[1].split('(')[0]
                times = np.arange(0, 30, 0.1)
                var_init = [0.5, 1.5, 2.0, 1.0]
                logger.info(f'Function {function_name} defined.')
                await websocket.send_text(f"Function '{function_name}' defined.")
            else:
                try:
                    params = json.loads(data)  # params = dict['params':list[float]]
                    logger.info(f'Params: {params}')
                    solution = solve_ode_with_euler(
                        functions[function_name], times=times, var_init=var_init, args=tuple(params['params'])
                    )
                    logger.info(f'Solution: {solution[:5]}')
                    response_data = json.dumps(solution.tolist())
                    await websocket.send_text(response_data)
                except Exception as e:
                    logger.error(f'Error processing parameters: {e}')
                    await websocket.send_text(f'Error: {str(e)}')

    except WebSocketDisconnect:
        logger.info('Client disconnected')
