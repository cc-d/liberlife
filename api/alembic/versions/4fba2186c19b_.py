"""empty message

Revision ID: 4fba2186c19b
Revises: e86b3a7719f4
Create Date: 2023-10-29 15:02:36.960203

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4fba2186c19b'
down_revision: Union[str, None] = 'e86b3a7719f4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('username', sa.String(length=255), nullable=False),
    sa.Column('hpassword', sa.String(length=255), nullable=False),
    sa.Column('created_on', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_on', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_table('goals',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('created_on', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_on', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_goals_id'), 'goals', ['id'], unique=False)
    op.create_table('goal_tasks',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('goal_id', sa.Integer(), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('completed', sa.Boolean(), nullable=False),
    sa.Column('created_on', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_on', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['goal_id'], ['goals.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_goal_tasks_id'), 'goal_tasks', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_goal_tasks_id'), table_name='goal_tasks')
    op.drop_table('goal_tasks')
    op.drop_index(op.f('ix_goals_id'), table_name='goals')
    op.drop_table('goals')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
    # ### end Alembic commands ###
