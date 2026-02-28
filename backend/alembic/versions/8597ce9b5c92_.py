"""empty message

Revision ID: 8597ce9b5c92
Revises: 4206104e9f2f, 8cd05a20104a
Create Date: 2026-02-28 11:26:47.003064

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8597ce9b5c92'
down_revision: Union[str, Sequence[str], None] = ('4206104e9f2f', '8cd05a20104a')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
