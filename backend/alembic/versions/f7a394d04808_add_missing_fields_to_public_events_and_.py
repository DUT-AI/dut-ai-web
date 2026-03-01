"""add_missing_fields_to_public_events_and_posts

Revision ID: f7a394d04808
Revises: 143f437632cc
Create Date: 2026-03-01 15:14:28.284759

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "f7a394d04808"
down_revision: Union[str, Sequence[str], None] = "143f437632cc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("posts", sa.Column("summary", sa.Text(), nullable=True))
    op.add_column("posts", sa.Column("events_date", sa.DateTime(), nullable=True))
    op.add_column("posts", sa.Column("facebook_url", sa.String(), nullable=True))
    op.add_column("public_events", sa.Column("summary", sa.Text(), nullable=True))
    op.add_column(
        "public_events", sa.Column("facebook_url", sa.String(), nullable=True)
    )
    op.add_column(
        "public_events", sa.Column("tags", postgresql.ARRAY(sa.String()), nullable=True)
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("public_events", "tags")
    op.drop_column("public_events", "facebook_url")
    op.drop_column("public_events", "summary")
    op.drop_column("posts", "facebook_url")
    op.drop_column("posts", "events_date")
    op.drop_column("posts", "summary")
