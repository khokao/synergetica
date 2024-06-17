from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from generator.api.main import app

client = TestClient(app)


def test_generator_api_with_valid_input():
    data = {
        'rbs_parameter': 4.2,
        'rbs_upstream': 'ATG',
        'rbs_downstream': 'GGG',
        'promoter_parameter': 3.1,
        'promoter_upstream': 'TATA',
    }

    response = client.post('/generate', json=data)

    assert response.status_code == HTTPStatus.OK
    json_response = response.json()
    assert isinstance(json_response['rbs_sequence'], str), 'rbs_sequence should be a string'
    assert isinstance(json_response['promoter_sequence'], str), 'promoter_sequence should be a string'


@pytest.mark.parametrize(
    'data',
    [
        {
            'rbs_parameter': 'invalid',  # rbs_parameter should be a float
            'rbs_upstream': 'ATG',
            'rbs_downstream': 'GGG',
            'promoter_parameter': 3.1,
            'promoter_upstream': 'TATA',
        },
        {
            'rbs_parameter': 'foobar',
            'rbs_upstream': 123,  # rbs_upstream should be a string
            'rbs_downstream': 'GGG',
            'promoter_parameter': 3.1,
            'promoter_upstream': 'TATA',
        },
        {
            'rbs_parameter': 'foobar',
            'rbs_upstream': 'ATG',
            'rbs_downstream': 123,  # rbs_downstream should be a string
            'promoter_parameter': 3.1,
            'promoter_upstream': 'TATA',
        },
        {
            'rbs_parameter': 'foobar',
            'rbs_upstream': 'ATG',
            'rbs_downstream': 'GGG',
            'promoter_parameter': 'invalid',  # promoter_parameter should be a float
            'promoter_upstream': 'TATA',
        },
        {
            'rbs_parameter': 'foobar',
            'rbs_upstream': 'ATG',
            'rbs_downstream': 'GGG',
            'promoter_parameter': 3.1,
            'promoter_upstream': None,  # promoter_upstream should be a string
        },
    ],
)
def test_generator_api_with_invalid_input(data):
    response = client.post('/generate', json=data)

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
