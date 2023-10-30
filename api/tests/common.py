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

USERNAME = "testuser2"
PASSWORD = "testpass2"
USERID = 1
HPASSWORD = hash_pass(PASSWORD)

LOGINJSON = {"username": USERNAME, "password": PASSWORD}

USERDB = SchemaUser.UserDB(
    id=USERID,
    username=USERNAME,
    hpassword=HPASSWORD,
    created_on=dt.utcnow(),
    updated_on=dt.utcnow(),
)

OAUTH_LOGIN_FORM = {
    "grant_type": "password",
    "username": USERNAME,
    "password": PASSWORD,
}


class GOALS:
    TEXTS = ['TESTGOAL%s' % i for i in range(2)]


class TASKS:
    TEXTS = ['TESTTASK%s' % i for i in range(2)]


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


@pytest.fixture(scope="session")
def event_loop(request):
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="module")
async def client():
    async with AsyncClient(app=app, base_url=f"http://test") as client:
        yield client


@pytest_asyncio.fixture(scope="session")
async def db() -> AsyncSession:
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await async_engine.dispose()


@pytest.fixture(scope="session")
async def transaction(db):
    session = sessionmaker(
        async_engine, class_=AsyncSession, expire_on_commit=False
    )()
    async with session.begin():
        yield session
        await session.rollback()


@pytest.fixture(scope="module")
async def reguser(client, db):
    resp = await client.post("/u/register", json=LOGINJSON)
    assert_token(resp)
    return headers(resp)


@pytest.fixture(scope="module")
async def getheaders_user(client, transaction, reguser):
    resp = await client.post("/u/login", json=LOGINJSON)
    heads = headers(resp)
    resp = await client.get("/u/me", headers=heads)
    assert resp.status_code == 200
    ujson = resp.json()
    assert ujson["username"] == LOGINJSON["username"]
    return heads, ujson


@pytest.fixture(scope="module")
def setup_goals(client, getheaders_user, event_loop):
    # Define the async function inside the fixture
    async def async_setup_goals():
        headers, ujson = await getheaders_user
        newgoals = []
        for text in GOALS.TEXTS:
            resp = await client.post(
                "/goals", json={"text": text}, headers=headers
            )
            assert resp.status_code == 200
            newgoals.append(resp.json())
        return newgoals, headers, ujson

    # Run the async function using an event loop and return the result
    return event_loop.run_until_complete(async_setup_goals())
