import json
from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from api.main import app
from api.routers.generator import get_child_id2key, get_parent2ordered_children
from api.schemas.generator import ReactFlowObject

client = TestClient(app)


def test_generator_api_with_valid_input(test_circuit, protein_ids):
    data = {
        'reactflow_object_json_str': json.dumps(test_circuit),
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
    reactflow_object_json_str, rbs_target_parameters, expected_status_code, test_circuit, protein_ids
):
    data = {'reactflow_object_json_str': reactflow_object_json_str, 'rbs_target_parameters': rbs_target_parameters}
    if data['reactflow_object_json_str'] == 'valid':
        data['reactflow_object_json_str'] = json.dumps(test_circuit)
    if data['rbs_target_parameters'] == 'valid':
        data['rbs_target_parameters'] = {protein_id: 100 for protein_id in protein_ids}

    response = client.post('/generate', json=data)

    assert response.status_code == expected_status_code


# NOTE: The test for request cancellation is omitted due to the high cost
# of simulating external API calls (e.g., Hugging Face downloads) and handling
# complex asynchronous cancellation behavior.


def test_parent2children_is_ordered(test_circuit, child_ids):
    parent_ids_order = ['true-friends-say', 'fast-baboons-wink']
    reactflow_object = ReactFlowObject(**test_circuit)

    parent2ordered_children = get_parent2ordered_children(reactflow_object.nodes)

    assert list(parent2ordered_children.keys()) == parent_ids_order
    assert {child_id for children in parent2ordered_children.values() for child_id in children} == set(child_ids)


def test_child_id2key_sequence(test_circuit, child_ids):
    reactflow_object = ReactFlowObject(**test_circuit)

    child_id2sequence = get_child_id2key(reactflow_object.nodes, 'sequence')

    assert set(child_id2sequence.keys()) == set(child_ids)
    assert all(sequence is not None for sequence in child_id2sequence.values())
