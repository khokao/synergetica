import pytest
from fastapi.testclient import TestClient

from api.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_formulate_and_simulate_flipflop(client, test_circuit_flipflop):
    # Arrange
    with client.websocket_connect('/ws') as websocket:
        # Act (formulate)
        websocket.send_json(
            {
                'type': 'formulate',
                'payload': {'rfobject': test_circuit_flipflop},
            }
        )

        # Assert (formulate)
        data = websocket.receive_json()
        assert data['type'] == 'formulated'
        assert 'protein_name2ids' in data['payload']

        # Act (simulate)
        websocket.send_json(
            {
                'type': 'simulate',
                'payload': {
                    'params': {
                        'chain-1-node-2-BM3R1': 1.0,
                        'chain-2-node-2-AmeR': 2.0,
                    }
                },
            }
        )

        # Assert (simulate)
        data = websocket.receive_json()
        assert data['type'] == 'simulated'
        assert len(data['payload']['solutions']) > 0


def test_formulate_and_simulate_hybrid(client, test_circuit_hybrid):
    # Arrange
    with client.websocket_connect('/ws') as websocket:
        # Act (formulate)
        websocket.send_json(
            {
                'type': 'formulate',
                'payload': {'rfobject': test_circuit_hybrid},
            }
        )

        # Assert (formulate)
        data = websocket.receive_json()
        assert data['type'] == 'formulated'
        assert 'protein_name2ids' in data['payload']

        # Act (simulate)
        websocket.send_json(
            {
                'type': 'simulate',
                'payload': {
                    'params': {
                        'chain-1-node-2-AmeR': 0.8,
                        'chain-2-node-2-AmtR': 1.5,
                        'chain-2-node-3-BetI': 0.4,
                        'chain-3-node-3-BetI': 0.3,
                    }
                },
            }
        )

        # Assert (simulate)
        data = websocket.receive_json()
        assert data['type'] == 'simulated'
        assert len(data['payload']['solutions']) > 0
