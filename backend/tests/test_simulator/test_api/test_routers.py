from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from simulator.api.main import app
from simulator.api.schemas import SimulatorOutput

client = TestClient(app)


def test_simulator_api_with_valid_input():
    data = {
        'param1': 1.0,
        'param2': 1.0,
    }

    response = client.post('/simulate-with-euler', params=data)

    # Assert
    assert response.status_code == HTTPStatus.OK

    json_response = response.json()
    SimulatorOutput(**json_response)


@pytest.mark.parametrize(
    'param',
    [
        {'param1': 'invalid', 'param2': 3.0},
        {'param1': 2.0, 'param2': 'invalid'},
        {'param1': '2.0', 'param2': 'invalid'},
    ],
)
def test_simulator_api_with_invalid_input(param):
    response = client.post('/simulate-with-euler', params=param)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
