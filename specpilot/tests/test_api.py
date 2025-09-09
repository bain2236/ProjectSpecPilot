from fastapi.testclient import TestClient
from specpilot.main import app

client = TestClient(app)

def test_command_rover_endpoint_success():
    # Arrange
    payload = {
        "grid_width": 10,
        "grid_height": 10,
        "obstacles": [[1, 2]],
        "initial_state": {"x": 0, "y": 0, "direction": "N"},
        "commands": "rff"
    }

    # Act
    response = client.post("/rover/command", json=payload)

    # Assert
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["final_state"] == {"x": 2, "y": 0, "direction": "E"}
    assert "successfully" in response_data["message"]


def test_command_rover_endpoint_validation_error():
    # Arrange
    payload = {
        "initial_state": {"x": 0, "y": 0, "direction": "N"},
        "commands": "fx" # 'x' is invalid
    }

    # Act
    response = client.post("/rover/command", json=payload)

    # Assert
    assert response.status_code == 422
