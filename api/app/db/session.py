from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from ..config import ASYNC_DATABASE_URL

Base = declarative_base()

# Async engine creation
engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)

# Async session local
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)
