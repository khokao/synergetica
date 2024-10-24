import json
from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from simulator.api.main import app
from simulator.api.schemas import ConverterOutput

client = TestClient(app)


@pytest.fixture
def convert_result_example():
    protein_id2name = {'RPp8K6j_urCFeMtsm2pZv': 'BM3R1', 'QaBV3nMXJxcNaNN_hE6ji': 'AmeR'}
    function_str = 'def ODEtoSolve(var:list[float],t:float,TIR1:float,TIR3:float):\n\td0dt = 300 * 0.5 * ((0.2 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[3] ** 2.0 + 3.0 ** 2.0)) / 1.0) * 15 - 0.012145749 * var[0]\n\td1dt = 0.01 * TIR1 * var[0] - 0.1 * var[1]\n\td2dt = 300 * 0.5 * ((0.2 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[1] ** 2.0 + 3.0 ** 2.0)) / 1.0) * 15 - 0.012145749 * var[2]\n\td3dt = 0.01 * TIR3 * var[2] - 0.1 * var[3]\n\treturn (d0dt, d1dt,d2dt, d3dt)'  # noqa: E501

    yield {'protein_id2name': protein_id2name, 'function_str': function_str}


def test_convert_gui_circuit_returns_correct_output(test_circuit):
    # Arrange
    sample_flow_data_json = json.dumps(test_circuit)
    endpoint = '/convert-gui-circuit'
    data = {'reactflow_object_json_str': sample_flow_data_json}

    # Act
    response = client.post(endpoint, json=data)
    response_data = response.json()

    # Assert
    assert response.status_code == HTTPStatus.OK
    ConverterOutput(**response_data)
    assert response_data['protein_id2name'] == {'RPp8K6j_urCFeMtsm2pZv': 'BM3R1', 'QaBV3nMXJxcNaNN_hE6ji': 'AmeR'}


def test_websocket_simulation(convert_result_example):
    # Arrange
    with client.websocket_connect('/ws/simulation') as websocket:
        # Act
        websocket.send_text(json.dumps(convert_result_example))
        response = websocket.receive_text()

        # Assert
        assert "Function 'ODEtoSolve' defined." in response

        # Act
        simulation_params = {'params': {'RPp8K6j_urCFeMtsm2pZv': 100, 'QaBV3nMXJxcNaNN_hE6ji': 200 }}
        websocket.send_text(json.dumps(simulation_params))
        response = websocket.receive_text()

        # Assert
        response_data = json.loads(response)
        assert isinstance(response_data, list)
        assert len(response_data[0]) == 4
        assert len(response_data) > 0
