import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, Mock
from api.app.schemas import user as SchemaUser
from api.app.routes import user as user_routes  # Make sure the path is correct
from api.app.main import app
from api.app.utils.security import decode_jwt, hash_pass

from .. import common as _comm


_client = TestClient(app)


@pytest.mark.asyncio
@patch('api.app.routes.user.CrudUser.get_from_username', new_callable=AsyncMock)
@patch('api.app.routes.user.async_addcomref', new_callable=AsyncMock)
@patch('api.app.routes.user.hash_pass', new_callable=Mock)
async def test_register(mock_hash_pass, mock_addcomref, mock_fromusername):
    mock_fromusername.return_value = None
    mock_addcomref.return_value = _comm.USERDB
    mock_hash_pass.return_value = _comm.HPASSWORD
    response = _client.post("/u/register", json=_comm.LOGINJSON)

    mock_fromusername.assert_called_once()
    mock_hash_pass.assert_called_once_with(_comm.LOGINJSON["password"])
    mock_addcomref.assert_called_once()

    _comm.assert_token(response)
    token = response.json()["access_token"]

    return token


@pytest.mark.asyncio
@patch('api.app.routes.user.hash_pass', new_callable=Mock)
@patch('api.app.crud.user.get_from_username', new_callable=AsyncMock)
async def test_register_duplicate_user(mock_get_from_username, mock_hash_pass):
    # Simulate a user already exists in the database
    mock_get_from_username.return_value = _comm.USERDB
    mock_hash_pass.return_value = _comm.HPASSWORD

    # Try to register a duplicate user
    response = _client.post("/u/register", json=_comm.LOGINJSON)

    assert response.status_code == 400
    assert "detail" in response.json()
    assert 'exists' in response.json()["detail"]


@pytest.mark.asyncio
@patch('api.app.routes.user.verify_pass', new_callable=Mock)
@patch('api.app.crud.user.get_from_username', new_callable=AsyncMock)
async def test_login(mock_get_from_username, mock_verify_pass):
    mock_get_from_username.return_value = _comm.USERDB
    mock_verify_pass.return_value = True

    response = _client.post("/u/login", json=_comm.LOGINJSON)

    _comm.assert_token(response)
    token = response.json()["access_token"]
    return token


@pytest.mark.asyncio
@patch('api.app.crud.user.verify_pass', new_callable=Mock)
@patch('api.app.crud.user.get_from_username', new_callable=AsyncMock)
async def test_login_invalid_password(mock_get_from_username, mock_verify_pass):
    mock_get_from_username.return_value = _comm.USERDB
    mock_verify_pass.return_value = False

    response = _client.post("/u/login", json=_comm.LOGINJSON)

    assert response.status_code == 401


# @pytest.mark.asyncio
# @patch('api.app.utils.dependencies.get_from_username', new_callable=AsyncMock)
# async def test_me(mock_get_from_username):
#    mock_get_from_username.return_value = _comm.USERDB
#    newtoken = await _token_and_decoded()
#
#    response = client.get("/u/me", headers=newtoken['headers'])
#    assert response.status_code == 200
#    rjson = response.json()
#    assert rjson['username'] == _comm.USERDB.username
#    assert rjson['id'] == _comm.USERDB.id
#    assert rjson['created_on'] == _comm.USERDB.created_on.isoformat()
#    assert rjson['updated_on'] == _comm.USERDB.updated_on.isoformat()
