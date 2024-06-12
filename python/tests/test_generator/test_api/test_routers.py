from fastapi.testclient import TestClient

from generator.api.main import app

client = TestClient(app)


def test_run_rbs_with_valid_param():
    data = {'parameter': 4.2}

    response = client.post('/generate-rbs', json=data)

    assert response.status_code == 200
    assert 'sequence' in response.json()
    assert isinstance(response.json()['sequence'], str)


def test_run_rbs_with_invalid_param():
    data = {'parameter': 'foobar'}

    response = client.post('/generate-rbs', json=data)

    assert response.status_code == 422  # Unprocessable Entity


def test_run_promoter_with_valid_param():
    data = {'parameter': 4.2}

    response = client.post('/generate-promoter', json=data)

    assert response.status_code == 200
    assert 'sequence' in response.json()
    assert isinstance(response.json()['sequence'], str)


def test_run_promoter_with_invalid_param():
    data = {'parameter': 'foobar'}

    response = client.post('/generate-promoter', json=data)

    assert response.status_code == 422  # Unprocessable Entity
