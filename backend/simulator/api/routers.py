from fastapi import APIRouter
from loguru import logger

from .schemas import SimulatorInput, SimulatorOutput

router = APIRouter()


@router.post('/simulator', response_model=SimulatorOutput)
async def run_simulation(input: SimulatorInput) -> SimulatorOutput:
    simulator_result = [1.0,2.0,3.0,4.0,5.0] # Dummy code. (TODO: Replace)
    return  simulator_result # Dummy code. (TODO: Replace)
