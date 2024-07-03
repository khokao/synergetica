from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from simulator.api.main import app

client = TestClient(app)


def test_get_data_param_default():
    response = client.get('/simulate-with-euler')
    assert response.status_code == 200
    json_response = response.json()
    assert isinstance(json_response['data1'], list), 'data1 should be a list of floats'
    assert isinstance(json_response['data2'], list), 'data2 should be a list of floats'
    assert isinstance(json_response['time'], list), 'time should be a list of floats'

    assert all(isinstance(item, float) for item in json_response['data1'])
    assert all(isinstance(item, float) for item in json_response['data2'])
    assert all(isinstance(item, float) for item in json_response['time'])


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
