from fastapi.testclient import TestClient

def test_create_user(client: TestClient):
    response = client.post(
        "/users/",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "hashed_password" not in data

def test_create_user_duplicate_email(client: TestClient):
    # Create the first user
    client.post(
        "/users/",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    # Attempt to create a second user with the same email
    response = client.post(
        "/users/",
        json={"email": "test@example.com", "password": "anotherpassword"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_for_access_token(client: TestClient):
    # First, create a user to log in with
    client.post(
        "/users/",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    # Now, log in
    response = client.post(
        "/token",
        data={"username": "test@example.com", "password": "testpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_get_current_user(client: TestClient):
    # Create user
    client.post("/users/", json={"email": "test@example.com", "password": "testpassword"})

    # Log in to get token
    login_response = client.post(
        "/token",
        data={"username": "test@example.com", "password": "testpassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token = login_response.json()["access_token"]

    # Access protected route
    response = client.get(
        "/users/me/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
