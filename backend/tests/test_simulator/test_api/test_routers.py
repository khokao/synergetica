from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from simulator.api.main import app
from simulator.api.schemas import SimulatorOutput

client = TestClient(app)


def test_get_data_param_default():
    response = client.get('/simulate-with-euler')
    assert response.status_code == HTTPStatus.OK
    response = response.json()
    try:
        SimulatorOutput(**response)
    except ValueError as e:
        raise AssertionError(f'Response does not match SimulatorOutput model: {e}') from e


def test_simulator_invalid_output():
    output = {'data1': [1.0, 2.0, 3.0], 'data2': ['str', 'str', 'str'], 'time': [1, 2, 3]}
    with pytest.raises(ValueError):
        SimulatorOutput(**output)


@pytest.mark.parametrize(
    'param',
    [
        {'param1': 'invalid', 'param2': 3.0},
        {'param1': 2.0, 'param2': 'invalid'},
        {'param1': '2.0', 'param2': 'invalid'},
    ],
)
def test_get_data_param_custom(param):
    response = client.get('/simulate-with-euler', params=param)
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
