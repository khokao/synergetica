from fastapi.testclient import TestClient

from simulator.api.main import app

client = TestClient(app)


def test_healthcheck():
    response = client.get('/healthcheck_simulator')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}
