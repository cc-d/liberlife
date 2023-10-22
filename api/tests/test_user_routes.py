import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, Mock
from api.app.schemas import user as SchemaUser
from api.app.routes import user as user_routes  # Make sure the path is correct
from api.app.main import app
from api.app.utils.security import decode_jwt, hash_pass

client = TestClient(app)


def _assert_token(resp):
    print(resp, resp.json())
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    assert resp.json()["token_type"] == "bearer"
    _decoded = decode_jwt(resp.json()["access_token"])
    assert "sub" in _decoded
    assert _decoded["sub"] == _login_json["username"]
    assert 'exp' in _decoded


_login_json = {"username": "test", "password": "test"}
_hpass = hash_pass(_login_json["password"])

_logreg_user = SchemaUser.UserDB(
    id=1,
    username="test",
    hpassword=_hpass,
    created_on=datetime.utcnow(),
    updated_on=datetime.utcnow(),
)


@pytest.mark.asyncio
@patch('api.app.routes.user.async_addcomref', new_callable=AsyncMock)
@patch('api.app.routes.user.hash_pass', new_callable=AsyncMock)
async def test_register(mock_hash_pass, mock_addcomref):
    mock_addcomref.return_value = _logreg_user
    mock_hash_pass.return_value = _hpass
    response = client.post("/u/register", json=_login_json)

    # Validate that async_addcomref was called
    mock_addcomref.assert_called_once()

    # Validate that hash_pass was called with the correct password
    mock_hash_pass.assert_called_once_with(_login_json["password"])

    _assert_token(response)
    token = response.json()["access_token"]

    return token


@pytest.mark.asyncio
@patch('api.app.routes.user.async_addcomref', new_callable=AsyncMock)
@patch('api.app.routes.user.hash_pass', new_callable=AsyncMock)
@patch('api.app.crud.user.get_from_username', new_callable=AsyncMock)
async def test_register_duplicate_user(
    mock_get_from_username, mock_hash_pass, mock_addcomref
):
    # Simulate a user already exists in the database
    mock_get_from_username.return_value = _logreg_user
    mock_hash_pass.return_value = _hpass

    # Try to register a duplicate user
    response = client.post("/u/register", json=_login_json)

    assert response.status_code == 400
    assert "detail" in response.json()
    assert 'exists' in response.json()["detail"]


@pytest.mark.asyncio
@patch('api.app.routes.user.verify_pass', new_callable=Mock)
@patch('api.app.crud.user.get_from_username', new_callable=AsyncMock)
async def test_login(mock_get_from_username, mock_verify_pass):
    mock_get_from_username.return_value = _logreg_user
    mock_verify_pass.return_value = True

    response = client.post("/u/login", json=_login_json)

    _assert_token(response)
    token = response.json()["access_token"]
    return token


@pytest.mark.asyncio
@patch('api.app.crud.user.verify_pass', new_callable=Mock)
@patch('api.app.crud.user.get_from_username', new_callable=AsyncMock)
async def test_login_invalid_password(mock_get_from_username, mock_verify_pass):
    mock_get_from_username.return_value = _logreg_user
    mock_verify_pass.return_value = False

    response = client.post("/u/login", json=_login_json)

    assert response.status_code == 401


async def _token_and_decoded():
    jwttoken = await test_login()
    decoded = decode_jwt(jwttoken)
    headers = {"Authorization": f"Bearer {jwttoken}"}
    return {'token': jwttoken, 'decoded': decoded, 'headers': headers}


@pytest.mark.asyncio
@patch('api.app.utils.dependencies.get_from_username', new_callable=AsyncMock)
async def test_me(mock_get_from_username):
    mock_get_from_username.return_value = _logreg_user
    newtoken = await _token_and_decoded()

    response = client.get("/u/me", headers=newtoken['headers'])
    assert response.status_code == 200
    rjson = response.json()
    assert rjson['username'] == _logreg_user.username
    assert rjson['id'] == _logreg_user.id
    assert rjson['created_on'] == _logreg_user.created_on.isoformat()
    assert rjson['updated_on'] == _logreg_user.updated_on.isoformat()
