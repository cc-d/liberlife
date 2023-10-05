import os


def evar(name, default=None):
    """returns assumed typed evar"""
    var = os.environ.get(name, default)
    lowvar = str(var).lower()
    if lowvar in ['true', 'false']:
        return lowvar == 'true'
    if lowvar.isdigit():
        return int(var)
    try:
        return float(var)
    except ValueError:
        return var


HOST = evar('LIBLIFE_HOST', 'localhost')
PORT = evar('LIBLIFE_PORT', 8999)

DB_NAME = 'liblifedb'
DB_USER = evar('LIBLIFE_DB_USER', 'pguser')
DB_PASS = evar('LIBLIFE_DB_PASS', 'pgpass')
DB_HOST = evar('LIBLIFE_DB_HOST', 'localhost')
DB_PORT = evar('LIBLIFE_DB_PORT', 5432)
DBMS = 'postgresql'
DATABASE_URL = f'{DBMS}://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

ASYNC_DATABASE_URL = (
    f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


JWT_KEY = '5h4itueghriuggegiferuffgrewukfgrw'
JWT_ALGO = 'HS256'
JWT_EXPIRE_SECS = 60 * 30
