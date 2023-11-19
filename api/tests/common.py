import asyncio
import os
from contextlib import asynccontextmanager
from datetime import datetime as dt
from typing import Generator, Optional

import pytest
import pytest_asyncio
from httpx import AsyncClient
from myfuncs import ranstr
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from api.app.db import get_adb, get_test_adb
from api.app.db.session import sync_engine, test_engine
from api.app.main import app
from api.app.schemas import goal as SchemaGoal
from api.app.schemas import user as SchemaUser
from api.app.utils.security import decode_jwt, hash_pass

from .utils import assert_token, headers, login, register, ume_resp


# Define a session-scoped event loop fixture
@pytest_asyncio.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.close()
    asyncio.set_event_loop(None)


@pytest_asyncio.fixture(scope="module")
async def create_db(event_loop):
    metadata_main = MetaData()
    metadata_main.reflect(bind=sync_engine)
    async with test_engine.begin() as conn:
        await conn.run_sync(metadata_main.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(metadata_main.drop_all)
    await test_engine.dispose()


# Modify client fixture to ensure it does not directly depend on event_loop
@pytest_asyncio.fixture(scope="module")
async def client(create_db):
    app.dependency_overrides[get_adb] = get_test_adb
    async with AsyncClient(app=app, base_url="http://test") as client_instance:
        yield client_instance
    del app.dependency_overrides[get_adb]


@pytest_asyncio.fixture(scope="module")
async def reguser(client):
    return await register(client)


@pytest_asyncio.fixture(scope="module")
async def userme(client, reguser):
    resp = client.get("/u/me", headers=headers(reguser))
    return resp


@pytest_asyncio.fixture(scope="module")
async def user_and_headers(reguser, userme):
    uh = headers(reguser)
    ume = await userme

    return ume.json(), uh
