from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from ..config import (
    ASYNC_DATABASE_URL,
    DATABASE_URL,
    ASYNC_TESTDB_URL,
    TESTDB_URL,
    SQL_ECHO,
)


# Sync engine creation
sync_engine = create_engine(DATABASE_URL, echo=SQL_ECHO, future=True)

Base = declarative_base()

# Async engine creation
async_engine = create_async_engine(
    ASYNC_DATABASE_URL, echo=SQL_ECHO, future=True
)

# Async session local
AsyncSessionLocal = sessionmaker(
    bind=async_engine, class_=AsyncSession, expire_on_commit=False
)

# Sync session local
SessionLocal = sessionmaker(bind=sync_engine, expire_on_commit=False)

# Testing
test_sync_engine = create_engine(TESTDB_URL, echo=SQL_ECHO, future=True)
test_engine = create_async_engine(ASYNC_TESTDB_URL, echo=SQL_ECHO, future=True)
TestSessionLocal = sessionmaker(bind=test_sync_engine, expire_on_commit=False)
TestAsyncSessionLocal = sessionmaker(
    bind=test_engine, expire_on_commit=False, class_=AsyncSession
)
