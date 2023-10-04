"""empty message

Revision ID: 5a7119204454
Revises: 
Create Date: 2023-10-04 16:44:52.993996

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5a7119204454'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('username', sa.String(length=50), nullable=True))
    op.alter_column('users', 'hpassword',
               existing_type=sa.VARCHAR(length=100),
               nullable=True)
    op.drop_index('ix_users_email', table_name='users')
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.drop_column('users', 'email')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('email', sa.VARCHAR(length=100), autoincrement=False, nullable=False))
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.create_index('ix_users_email', 'users', ['email'], unique=False)
    op.alter_column('users', 'hpassword',
               existing_type=sa.VARCHAR(length=100),
               nullable=False)
    op.drop_column('users', 'username')
    # ### end Alembic commands ###
