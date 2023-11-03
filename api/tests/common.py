import asyncio
import os
from contextlib import asynccontextmanager
from datetime import datetime as dt
from typing import Generator, Optional

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

from .data import (
    GOALS,
    LOGINJSON,
    PASSWORD,
    USERNAME,
    HPASSWORD,
    TASKS,
    USERDB,
    OAUTH_LOGIN_FORM,
)
from .utils import assert_token, headers, login, register, ume_resp


@pytest.fixture(scope="module")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="module")
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


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


@pytest.fixture(scope="module")
async def loginresp(client, reguser):
    uh = await login(client)
    return uh


@pytest.fixture
async def funclogin(client):
    return await login(client)


@pytest.fixture(scope="module")
async def reguser(client, create_db):
    return await register(client)


@pytest.fixture(scope="module")
async def userme(client, reguser, loginresp):
    return await ume_resp(client)


@pytest_asyncio.fixture(scope="module")
async def user_and_headers(client, create_db, loginresp, userme):
    lr = await loginresp
    ume = await userme
    return ume.json(), headers(lr)
