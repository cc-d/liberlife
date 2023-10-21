import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, Mock
from api.app.schemas import user as SchemaUser
from api.app.routes import user as user_routes  # Make sure the path is correct
from api.app.main import app
from api.app.utils.security import verify_pass

client = TestClient(app)


def _assert_token(resp):
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    assert resp.json()["token_type"] == "bearer"


@pytest.mark.asyncio
@patch('api.app.routes.user.async_addcomref', new_callable=AsyncMock)
@patch('api.app.routes.user.hash_pass', new_callable=AsyncMock)
async def test_register(mock_hash_pass, mock_addcomref):
    mock_hash_pass.return_value = "hashed_password"
    response = client.post(
        "/u/register", json={"username": "test", "password": "test"}
    )
    _assert_token(response)


@pytest.mark.asyncio
@patch('api.app.routes.user.verify_pass', new_callable=Mock)
@patch('api.app.crud.user.get_from_username', new_callable=AsyncMock)
async def test_login(mock_get_from_username, mock_verify_pass):
    print(
        "Is mock_verify_pass called?", mock_verify_pass.called
    )  # Should print False

    mock_get_from_username.return_value = SchemaUser.UserDB(
        id=1,
        username="test",
        hpassword="test",
        created_on=datetime.utcnow(),
        updated_on=datetime.utcnow(),
    )
    mock_verify_pass.return_value = True

    response = client.post(
        "/u/login", json={"username": "test", "password": "test"}
    )

    _assert_token(response)
