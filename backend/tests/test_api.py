from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_calculation():
    response = client.post(
        "/api/v1/calculations",
        json={"operation": "multiply", "operands": [6, 7]},
    )
    assert response.status_code == 200
    assert response.json() == {
        "operation": "multiply",
        "operands": [6.0, 7.0],
        "result": 42.0,
        "expression": "6 × 7",
    }


def test_division_by_zero_returns_useful_error():
    response = client.post(
        "/api/v1/calculations",
        json={"operation": "divide", "operands": [6, 0]},
    )
    assert response.status_code == 422
    assert response.json() == {"detail": "Division by zero is not allowed."}


def test_invalid_operation_returns_validation_error():
    response = client.post(
        "/api/v1/calculations",
        json={"operation": "modulo", "operands": [6, 2]},
    )
    assert response.status_code == 422
