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
    session,
    OAUTH_LOGIN_FORM,
    GOALS,
    get_headers_user,
    TASKS,
)


def _headers(resp):
    assert resp.status_code == 200
    assert_token(resp)
    token = resp.json()["access_token"]
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }


@pytest.mark.asyncio
async def test_register(client, session):
    resp = await client.post("/u/register", json=LOGINJSON)
    return _headers(resp)


@pytest.mark.asyncio
async def test_login(client, session):
    await test_register(client, session)
    resp = await client.post("/u/login", json=LOGINJSON)
    return _headers(resp)


@pytest.mark.asyncio
async def test_oauth_login(client, session):
    await test_register(client, session)
    resp = await client.post(
        "/u/oauth_login",
        data=OAUTH_LOGIN_FORM,
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
    )

    return _headers(resp)


@pytest.mark.asyncio
async def test_register_duplicate_user(client, session):
    await test_register(client, session)
    resp = await client.post("/u/register", json=LOGINJSON)
    assert resp.status_code == 400
    assert "exists" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_me(client, session):
    headers = await test_login(client, session)
    resp = await client.get("/u/me", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["username"] == USERNAME
