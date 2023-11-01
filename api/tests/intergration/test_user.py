import pytest
import json
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch, Mock, ANY as MOCKANY
from api.app.db.session import (
    AsyncSessionLocal,
    SessionLocal,
    Base,
    async_engine,
    sync_engine,
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
    loginheaders,
    reguser,
)
from logfunc import logf


@pytest.mark.asyncio
async def test_register(client, reguser):
    # User is already registered by the fixture
    heads = await reguser


@pytest.mark.asyncio
async def test_login(client, reguser):
    resp = await client.post("/u/login", json=LOGINJSON)


@pytest.mark.asyncio
async def test_oauth_login(client, reguser):
    resp = await client.post(
        "/u/oauth_login",
        data=OAUTH_LOGIN_FORM,
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
    )
    headers(resp)


@pytest.mark.asyncio
async def test_register_duplicate_user(client, reguser):
    # Since the user is already registered, try registering again
    resp = await client.post("/u/register", json=LOGINJSON)
    assert resp.status_code == 400
    assert "exists" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_me(client, userme):
    userme = await userme
    assert userme['username'] == USERNAME
