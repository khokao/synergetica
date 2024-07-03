import numpy as np
from fastapi import APIRouter, Query
from loguru import logger

from simulator.euler import run_euler_example

from .schemas import SimulatorOutput

router = APIRouter()


@router.get('/simulate-with-euler', response_model=SimulatorOutput)
async def get_data_param(param1: float = Query(1.0), param2: float = Query(1.0)) -> SimulatorOutput:
    logger.info(f'Simulating with parameters: {param1}, {param2}')
    solution = run_euler_example(alpha1=param1, alpha2=param2)
    time = np.arange(0, len(solution)).tolist()
    return SimulatorOutput(data1=solution[:, 0].tolist(), data2=solution[:, 1].tolist(), time=time)
