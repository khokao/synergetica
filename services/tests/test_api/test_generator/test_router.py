from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_generator_api_with_valid_input():
    data = {
        'protein_target_values': {'protein-1': 100, 'protein-2': 100},
    }

    response = client.post('/generate', json=data)

    assert response.status_code == HTTPStatus.OK


@pytest.mark.parametrize(
    'protein_target_values, expected_status_code',
    [
        ({}, HTTPStatus.UNPROCESSABLE_ENTITY),  # Empty protein_target_values
        ({'protein-1': -100}, HTTPStatus.UNPROCESSABLE_ENTITY),  # Negative target value
    ],
)
def test_generator_api_with_invalid_input(
    protein_target_values,
    expected_status_code,
):
    data = {
        'protein_target_values': protein_target_values,
    }

    response = client.post('/generate', json=data)

    assert response.status_code == expected_status_code
