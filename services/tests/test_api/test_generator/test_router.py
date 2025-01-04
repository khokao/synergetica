from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_generator_api_with_valid_input():
    data = {
        'protein_target_values': {'protein-1': 100, 'protein-2': 100},
        'protein_init_sequences': {'protein-1': 'ATGC', 'protein-2': 'ATGC'},
    }

    response = client.post('/generate', json=data)

    assert response.status_code == HTTPStatus.OK


@pytest.mark.parametrize(
    'protein_target_values, protein_init_sequences, expected_status_code',
    [
        ({}, {'protein-1': 'ATGC'}, HTTPStatus.UNPROCESSABLE_ENTITY),  # Empty protein_target_values
        ({'protein-1': 100}, {}, HTTPStatus.UNPROCESSABLE_ENTITY),  # Empty protein_init_sequences
        ({'protein-1': -100}, {'protein-1': 'ATGC'}, HTTPStatus.UNPROCESSABLE_ENTITY),  # Negative target value
        ({'protein-1': 100}, {'protein-1': 'ATCGX'}, HTTPStatus.UNPROCESSABLE_ENTITY),  # Invalid sequence
    ],
)
def test_generator_api_with_invalid_input(
    protein_target_values,
    protein_init_sequences,
    expected_status_code,
):
    data = {
        'protein_target_values': protein_target_values,
        'protein_init_sequences': protein_init_sequences,
    }

    response = client.post('/generate', json=data)

    assert response.status_code == expected_status_code
