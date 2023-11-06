from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from .session import (
    SessionLocal,
    AsyncSessionLocal,
    TestSessionLocal,
    TestAsyncSessionLocal,
)
from contextlib import contextmanager, asynccontextmanager


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_adb() -> AsyncSession:
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()


def get_test_db() -> Session:
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_test_adb() -> AsyncSession:
    db = TestAsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
