from http import HTTPStatus

from fastapi.testclient import TestClient

from simulator.api.main import app

client = TestClient(app)


def test_healthcheck():
    response = client.get('/healthcheck-simulator')
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'status': 'ok'}
