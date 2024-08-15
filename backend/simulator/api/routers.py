import json

import numpy as np
from fastapi import APIRouter, Query
from loguru import logger
from omegaconf import OmegaConf

from simulator.modules.build_protein_interaction import run_convert
from simulator.modules.euler import run_euler_example

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
    proteins = list(proteinId_idx_bidict.keys())
    return ConverterOutput(num_protein=num_protein, proteins=proteins)
