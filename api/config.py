DB_NAME = 'liblifedb'
DB_USER, DB_PASS = 'pguser', 'pgpass'
DB_HOST = 'localhost'
DB_PORT = 5432
DBMS = 'postgresql'
DB_URL = f'{DBMS}://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
