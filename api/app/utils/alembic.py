from alembic import op
from sqlalchemy.sql import text
from sqlalchemy.engine import Connection
from typing import Optional as Opt


def column_exists(
    table_name: str, column_name: str, alembic_conn: Opt[Connection] = None
) -> bool:
    """Check if a column exists in a table in the alembic.ini db"""
    conn = alembic_conn or op.get_bind()
    query = text(
        "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE "
        "table_name=:table_name AND column_name=:column_name)"
    )
    result = conn.execute(
        query, [{"table_name": table_name, "column_name": column_name}]
    )
    return result.scalar()
