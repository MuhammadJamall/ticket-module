import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="session")
def client():
    return TestClient(app)


@pytest.fixture
def admin_token(client):
    response = client.post("/auth/login", data={
        "username": "admin@test.com",
        "password": "Test1234!"
    })
    
    if response.status_code == 200:
        return response.json().get("access_token", "mock-admin-token")
    
    return "mock-admin-token"


@pytest.fixture
def user_token(client):
    """Fixture: Returns regular user JWT token"""
    response = client.post("/auth/login", data={
        "username": "user@test.com",
        "password": "Test1234!"
    })
    
    if response.status_code == 200:
        return response.json().get("access_token", "mock-user-token")
    
    return "mock-user-token"


@pytest.fixture
def manager_token(client):
    response = client.post("/auth/login", data={
        "username": "manager@test.com",
        "password": "Test1234!"
    })
    
    if response.status_code == 200:
        return response.json().get("access_token", "mock-manager-token")
    
    return "mock-manager-token"