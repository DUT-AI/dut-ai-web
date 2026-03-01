"""merge_heads

Revision ID: 1bab2c00b1f7
Revises: 79b6e5351799, abe728c6e179
Create Date: 2026-03-01 01:00:33.031438

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1bab2c00b1f7'
down_revision: Union[str, Sequence[str], None] = ('79b6e5351799', 'abe728c6e179')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
