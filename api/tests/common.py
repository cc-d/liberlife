import asyncio
import json
import os
from typing import Generator, Optional, Union
from contextlib import asynccontextmanager
from datetime import datetime as dt
from typing import Generator, Optional
from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from api.app.db.session import (
    AsyncSessionLocal,
    Base,
    SessionLocal,
    async_engine,
    sync_engine,
)
from api.app.main import app
from api.app.schemas import goal as SchemaGoal
from api.app.schemas import user as SchemaUser
from api.app.utils.security import decode_jwt, hash_pass

from ..app.db.session import Base, async_engine, sync_engine

from .data import (
    GOALS,
    LOGINJSON,
    PASSWORD,
    USERNAME,
    USERDB,
    HPASSWORD,
    TASKS,
    OAUTH_LOGIN_FORM,
)


def assert_token(resp):
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    assert resp.json()["token_type"] == "bearer"
    _decoded = decode_jwt(resp.json()["access_token"])
    assert "sub" in _decoded
    assert _decoded["sub"] == LOGINJSON["username"]
    assert 'exp' in _decoded


def headers(resp):
    assert resp.status_code == 200
    assert_token(resp)
    token = resp.json()["access_token"]
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }


@pytest.fixture(scope="module")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="module")
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest_asyncio.fixture(scope="module")
async def create_db() -> AsyncSession:
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await async_engine.dispose()


async def register(client):
    resp = await client.post("/u/register", json=LOGINJSON)
    return headers(resp)


async def login(client):
    resp = await client.post("/u/login", json=LOGINJSON)
    return resp


@pytest.fixture(scope="module")
async def loginresp(client, reguser):
    uh = await login(client)
    return uh


async def ume_resp(client):
    uh = await login(client)
    uh = headers(uh)
    resp = await client.get("/u/me", headers=uh)
    return resp


@pytest.fixture
async def funclogin(client):
    return await login(client)


@pytest.fixture(scope="module")
async def reguser(client, create_db):
    return await register(client)


@pytest.fixture(scope="module")
async def userme(client, reguser, loginresp):
    uh = await loginresp
    resp = await client.get("/u/me", headers=headers(uh))
    assert resp.status_code == 200
    return resp.json()


@pytest_asyncio.fixture(scope="module")
async def user_and_headers(client, create_db, reguser, loginresp):
    r = await loginresp
    assert r.status_code == 200
    assert_token(r)

    ume = await ume_resp(client)
    assert ume.status_code == 200

    return ume.json(), headers(r)
