import os
from myfuncs import typed_evar as evar
from logfunc import logf


HOST = evar('API_HOST')
PORT = evar('API_PORT')

DB_NAME = 'liblifedb'
DB_USER = evar('DB_USER', 'pguser')
DB_PASS = evar('DB_PASS', 'pgpass')
DB_HOST = evar('DB_HOST', 'localhost')
DB_PORT = evar('DB_PORT', 5432)
DBMS = 'postgresql'
DATABASE_URL = f'{DBMS}://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

ASYNC_DATABASE_URL = (
    f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

TESTDB_NAME = f'test_{DB_NAME}'
TESTDB_URL = f'{DBMS}://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{TESTDB_NAME}'
ASYNC_TESTDB_URL = (
    f'{DBMS}+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{TESTDB_NAME}'
)


JWT_KEY = evar('API_JWT_SECRET', 'secret')
JWT_ALGO = 'HS256'
JWT_EXPIRE_SECS = 60 * 60 * 24 * 7  # 1 week
