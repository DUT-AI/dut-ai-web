"""drop obsolete content column from blogs

Revision ID: 9f3c2a1b7d4e
Revises: 1520c599f71a
Create Date: 2026-09-10 23:30:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = "9f3c2a1b7d4e"
down_revision: Union[str, None] = "1520c599f71a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove the legacy field that is no longer part of the blog schema."""
    op.drop_column("blogs", "content")


def downgrade() -> None:
    """Restore the legacy field with a safe value for rows created later."""
    op.add_column("blogs", sa.Column("content", sa.Text(), nullable=True))
    op.execute("UPDATE blogs SET content = '' WHERE content IS NULL")
    op.alter_column("blogs", "content", existing_type=sa.Text(), nullable=False)
