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
    db,
    OAUTH_LOGIN_FORM,
    GOALS,
    getheaders_user,
    TASKS,
    headers,
    transaction,
    reguser,
)
from logfunc import logf


@pytest.mark.asyncio
@logf(use_print=True)
async def test_register(client, transaction, reguser):
    # User is already registered by the fixture
    heads = await reguser


@pytest.mark.asyncio
async def test_login(client, transaction, reguser):
    resp = await client.post("/u/login", json=LOGINJSON)


@pytest.mark.asyncio
async def test_oauth_login(client, transaction, reguser):
    resp = await client.post(
        "/u/oauth_login",
        data=OAUTH_LOGIN_FORM,
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
    )
    headers(resp)


@pytest.mark.asyncio
async def test_register_duplicate_user(client, transaction, reguser):
    # Since the user is already registered, try registering again
    resp = await client.post("/u/register", json=LOGINJSON)
    assert resp.status_code == 400
    assert "exists" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_me(client, transaction, getheaders_user):
    headers, ujson = await getheaders_user
    assert headers['Authorization'].startswith('Bearer ')
