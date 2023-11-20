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
from ..data import USERNAME, PASSWORD, LOGINJSON, OAUTH_LOGIN_FORM, USERDB
from ..common import (
    assert_token,
    client,
    create_db,
    headers as uheads,
    reguser,
    userme,
    reguser,
    event_loop,
)
from myfuncs import ranstr
from logfunc import logf
from ..utils import apireq
from api.app.utils.dependencies import get_current_user
from api.app.db import get_test_adb


@pytest.mark.asyncio
async def test_register(client):
    json = {"username": ranstr(20), "password": ranstr(20)}
    resp = await apireq(client.post, "/u/register", json)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_login(client, reguser):
    resp = await apireq(client.post, "/u/login", LOGINJSON)
    uheads(resp)


@pytest.mark.asyncio
async def test_oauth_login(client, reguser):
    resp = await apireq(
        client.post,
        "/u/oauth_login",
        {"Content-Type": "application/x-www-form-urlencoded"},
        data=OAUTH_LOGIN_FORM,
    )
    uheads(resp)


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
    resp = await client.post("/u/register", json=LOGINJSON)
    assert resp.status_code == 409
    assert "exists" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_me(client, reguser):
    uh = uheads(reguser)
    resp = await apireq(client.get, "/u/me", headers=uh)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_get_curuser_error():
    async for db in get_test_adb():
        try:
            err = await get_current_user(token="asdf", db=db)
        except Exception as e:
            assert e.status_code == 401
            assert e.detail == "Could not validate credentials"
