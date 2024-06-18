from fastapi.testclient import TestClient

from generator.api.main import app

client = TestClient(app)


def test_healthcheck():
    response = client.get('/healthcheck')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}
