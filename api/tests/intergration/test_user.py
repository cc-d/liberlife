import pytest
import json
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch, Mock, ANY as MOCKANY
from api.app.db import get_adb, get_test_adb
from api.app.db.session import (
    AsyncSessionLocal,
    SessionLocal,
    Base,
    async_engine,
    sync_engine,
    test_engine,
    test_sync_engine,
    TestAsyncSessionLocal,
    TestSessionLocal,
)
from api.app.main import app
from ..common import (
    USERDB,
    LOGINJSON,
    assert_token,
    USERNAME,
    PASSWORD,
    HPASSWORD,
    event_loop,
    client,
    create_db,
    OAUTH_LOGIN_FORM,
    GOALS,
    TASKS,
    headers,
    reguser,
    userme,
    reguser,
    loginresp,
)
from myfuncs import ranstr
from logfunc import logf


@pytest.mark.asyncio
async def test_register(client, reguser):
    assert_token(await reguser)


@pytest.mark.asyncio
async def test_login(client, reguser, loginresp):
    assert_token(await loginresp)


@pytest.mark.asyncio
async def test_oauth_login(client, reguser):
    resp = await client.post(
        "/u/oauth_login",
        data=OAUTH_LOGIN_FORM,
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
    )
    headers(resp)


@pytest.mark.asyncio
async def test_nouser_login(client):
    json = {"username": ranstr(20), "password": ranstr(20)}
    resp = await client.post("/u/login", json=json)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_wrongpass_login(client, reguser):
    json = {"username": USERNAME, "password": ranstr(20)}
    resp = await client.post("/u/login", json=json)
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_register_duplicate_user(client, reguser):
    # Since the user is already registered, try registering again
    resp = await client.post("/u/register", json=LOGINJSON)
    assert resp.status_code == 400
    assert "exists" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_me(client, reguser, userme):
    ume = await userme
    assert ume.status_code == 200
    ume = ume.json()
    assert "username" in ume
    assert "id" in ume
    assert ume["username"] == USERNAME
    assert ume["id"] == USERDB.id
