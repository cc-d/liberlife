"""test autogenerate

Revision ID: a1c28f04cf0b
Revises: ac4fc59a28ee
Create Date: 2023-12-02 09:43:18.125175

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1c28f04cf0b'
down_revision: Union[str, None] = 'ac4fc59a28ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
