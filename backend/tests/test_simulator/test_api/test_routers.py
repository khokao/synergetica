import json

import pytest
from circuit_for_test import TEST_CIRCUIT
from fastapi.testclient import TestClient

from simulator.api.main import app
from simulator.api.schemas import ConverterOutput

client = TestClient(app)


@pytest.fixture
def sample_flow_data_json():
    circuit = TEST_CIRCUIT
    yield json.dumps(circuit)


@pytest.fixture
def expected_function():
    function_str = 'def ODEtoSolve(var:list[float],t:float,TIR1:float,TIR3:float):\n\td0dt = 300 * 0.5 * ((1.0 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[3] ** 2.0 + 3.0 ** 2.0)) / 1.0) *  15 - 0.012145749 * var[0]\n\td1dt = 1e-05 * TIR1 * var[0] - 0.1 * var[1]\n\td2dt = 300 * 0.5 * ((1.0 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[1] ** 2.0 + 3.0 ** 2.0)) / 1.0) *  15 - 0.012145749 * var[2]\n\td3dt = 1e-05 * TIR3 * var[2] - 0.1 * var[3]\n\treturn (d0dt, d1dt,d2dt, d3dt)'  # noqa: E501
    yield function_str


def test_convert_gui_circuit_returns_correct_output(sample_flow_data_json, expected_function):
    # Arrange
    endpoint = '/convert-gui-circuit'
    data = {'flow_data_json': sample_flow_data_json}

    # Act
    response = client.post(endpoint, json=data)

    # Assert
    assert response.status_code == 200
    response_data = response.json()
    assert isinstance(response_data, dict)
    assert 'num_protein' in response_data
    assert 'proteins' in response_data
    assert 'function_str' in response_data

    expected_output = ConverterOutput(num_protein=2, proteins=['BM3R1', 'AmeR'], function_str=expected_function)
    assert response_data['num_protein'] == expected_output.num_protein
    assert response_data['proteins'] == expected_output.proteins
    assert 'def ' in response_data['function_str']


def test_websocket_simulation(expected_function):
    # Arrange
    with client.websocket_connect('/ws/simulation') as websocket:
        # Act
        function_definition = expected_function
        websocket.send_text(function_definition)
        response = websocket.receive_text()

        # Assert
        assert "Function 'ODEtoSolve' defined." in response

        # Act
        simulation_params = {'params': [2, 5]}
        websocket.send_text(json.dumps(simulation_params))
        response = websocket.receive_text()

        # Assert
        response_data = json.loads(response)
        assert isinstance(response_data, list)
        assert len(response_data[0]) == 4
        assert len(response_data) > 0
