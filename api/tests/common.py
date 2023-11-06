import asyncio
import os
from contextlib import asynccontextmanager
from datetime import datetime as dt
from typing import Generator, Optional

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from api.app.db import get_adb, get_test_adb
from api.app.db.session import (
    AsyncSessionLocal,
    Base,
    SessionLocal,
    async_engine,
    sync_engine,
    test_engine,
    test_sync_engine,
    TestAsyncSessionLocal,
    TestSessionLocal,
)
from api.app.main import app
from api.app.schemas import goal as SchemaGoal
from api.app.schemas import user as SchemaUser
from api.app.utils.security import decode_jwt, hash_pass

from .utils import assert_token, headers, login, register, ume_resp


@pytest.fixture(scope="module")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="module")
async def create_db() -> AsyncSession:
    metadata_main = MetaData()
    metadata_main.reflect(bind=sync_engine)
    async with test_engine.begin() as conn:
        # print("Creating tables", metadata_main.tables)
        await conn.run_sync(metadata_main.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(metadata_main.drop_all)
    await test_engine.dispose()


@pytest_asyncio.fixture(scope="module")
async def client(create_db) -> AsyncClient:
    app.dependency_overrides[get_adb] = get_test_adb
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    del app.dependency_overrides[get_adb]


@pytest.fixture(scope="module")
async def loginresp(client, reguser):
    uh = await login(client)
    return uh


@pytest.fixture
async def funclogin(client):
    return await login(client)


@pytest.fixture(scope="module")
async def reguser(client):
    return await register(client)


@pytest.fixture(scope="module")
async def userme(client, reguser):
    return await ume_resp(client)


@pytest_asyncio.fixture(scope="module")
async def user_and_headers(loginresp, userme):
    lr = await loginresp
    ume = await userme
    return ume.json(), headers(lr)
