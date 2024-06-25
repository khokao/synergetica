from typing import Dict, List

import numpy as np
from fastapi import APIRouter, Query

from simulator.euler import run_euler_example

from .schemas import SimulatorInput, SimulatorOutput

router = APIRouter()


@router.post('/simulator', response_model=SimulatorOutput)
async def run_simulation(input: SimulatorInput) -> SimulatorOutput:
    simulator_result = [1.0, 2.0, 3.0, 4.0, 5.0]  # Dummy code. (TODO: Replace)
    return simulator_result  # Dummy code. (TODO: Replace)


@router.get('/graph_interact', response_model=Dict[str, List[float]])
async def get_data_param(param1: float = Query(1.0), param2: float = Query(1.0)) -> Dict[str, List[float]]:
    solution = run_euler_example(alpha1=param1, alpha2=param2)
    time = [str(t) for t in np.arange(0, len(solution)).tolist()]
    return {'data1': solution[:, 0].tolist(), 'data2': solution[:, 1].tolist(), 'time': time}
