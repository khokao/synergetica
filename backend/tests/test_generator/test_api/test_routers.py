import json
from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from generator.api.main import app

client = TestClient(app)


def test_generator_api_with_valid_input(get_test_circuit, protein_ids):
    data = {
        'reactflow_object_json_str': json.dumps(get_test_circuit),
        'rbs_target_parameters': {protein_id: 100 for protein_id in protein_ids},
    }

    response = client.post('/generate', json=data)

    assert response.status_code == HTTPStatus.OK


@pytest.mark.parametrize(
    'reactflow_object_json_str, rbs_target_parameters, expected_status_code',
    [
        ('', 'valid', HTTPStatus.UNPROCESSABLE_ENTITY),  # Empty reactflow_object_json_str
        ('invalid_json', 'valid', HTTPStatus.UNPROCESSABLE_ENTITY),  # Invalid JSON
        ('valid', {}, HTTPStatus.UNPROCESSABLE_ENTITY),  # Empty rbs_target_parameters
        ('valid', {'non_existing_id': 100}, HTTPStatus.UNPROCESSABLE_ENTITY),  # Non-existing protein ID
    ],
)
def test_generator_api_with_invalid_input(
    reactflow_object_json_str, rbs_target_parameters, expected_status_code, get_test_circuit, protein_ids
):
    data = {'reactflow_object_json_str': reactflow_object_json_str, 'rbs_target_parameters': rbs_target_parameters}
    if data['reactflow_object_json_str'] == 'valid':
        data['reactflow_object_json_str'] = json.dumps(get_test_circuit)
    if data['rbs_target_parameters'] == 'valid':
        data['rbs_target_parameters'] = {protein_id: 100 for protein_id in protein_ids}

    response = client.post('/generate', json=data)

    assert response.status_code == expected_status_code


# NOTE: The test for request cancellation is omitted due to the high cost
# of simulating external API calls (e.g., Hugging Face downloads) and handling
# complex asynchronous cancellation behavior.
