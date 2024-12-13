from http import HTTPStatus

from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def test_healthcheck():
    response = client.get('/healthcheck')
    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'status': 'ok'}
