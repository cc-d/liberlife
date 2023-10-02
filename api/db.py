import asyncpg
from asyncpg.connection import Connection
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import DATABASE_URL


async def get_db() -> Connection:
    adb = await asyncpg.connect(DATABASE_URL)
