from fastapi import APIRouter
from loguru import logger

from .schemas import SimulatorInput, SimulatorOutput

router = APIRouter()


@router.post('/simulate-run', response_model=SimulatorOutput)
async def simulate_run(input: SimulatorInput) -> SimulatorOutput:
    logger.info(f'Simulating run with circuit graph: {input.circuit_graph}')
    return SimulatorOutput(parameter=0.1)  # Dummy code. (TODO: Replace with actual implementation)
