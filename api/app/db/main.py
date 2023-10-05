from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from .session import SessionLocal, AsyncSessionLocal


def get_sync_db() -> Session:
    """
    Get a synchronous database session.

    Returns:
        Session: A synchronous database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db() -> AsyncSession:
    """
    Get an asynchronous database session.

    Returns:
        AsyncSession: An asynchronous database session.
    """
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()
