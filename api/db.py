import asyncpg
from asyncpg.connection import Connection
from .config import DB_URL


async def get_db() -> Connection:
    adb = await asyncpg.connect(DB_URL)
