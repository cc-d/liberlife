from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from ..config import ASYNC_DATABASE_URL, DATABASE_URL

Base = declarative_base()

# Async engine creation
async_engine = create_async_engine(ASYNC_DATABASE_URL, echo=True, future=True)

# Async session local
AsyncSessionLocal = sessionmaker(
    bind=async_engine, class_=AsyncSession, expire_on_commit=False
)

# Sync engine creation
sync_engine = create_engine(DATABASE_URL, echo=True)

# Sync session local
SessionLocal = sessionmaker(bind=sync_engine, expire_on_commit=False)
