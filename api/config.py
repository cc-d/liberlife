HOST = 'localhost'
PORT = '8999'

DB_NAME = 'liblifedb'
DB_USER, DB_PASS = 'pguser', 'pgpass'
DB_HOST = 'localhost'
DB_PORT = 5432
DBMS = 'postgresql'
DATABASE_URL = f'{DBMS}://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'


JWT_KEY = '5h4itueghriuggegiferuffgrewukfgrw'
JWT_ALGO = 'HS256'
JWT_EXPIRE_SECS = 60 * 30
