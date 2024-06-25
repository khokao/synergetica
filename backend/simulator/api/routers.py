from fastapi import APIRouter
from loguru import logger

from .schemas import SimulatorInput, SimulatorOutput
from typing import List,Dict
import numpy as np

router = APIRouter()


@router.post('/simulator', response_model=SimulatorOutput)
async def run_simulation(input: SimulatorInput) -> SimulatorOutput:
    simulator_result = [1.0,2.0,3.0,4.0,5.0] # Dummy code. (TODO: Replace)
    return  simulator_result # Dummy code. (TODO: Replace)

@router.get('/graph',response_model=Dict[str,List[float]])
async def get_data(data_len=100):
    data1 = np.random.rand(data_len).tolist()  # numpy array to list
    data2 = np.random.rand(data_len).tolist()  # numpy array to list
    time = [str(t) for t in np.arange(0, data_len).tolist()]
    
    return {'data1':data1,'data2':data2,'time':time}
