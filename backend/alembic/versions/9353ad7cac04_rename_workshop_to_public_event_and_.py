"""rename_workshop_to_public_event_and_memorable_event_to_post

Revision ID: 9353ad7cac04
Revises: eac1af56085d
Create Date: 2026-03-01 01:29:19.546105

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9353ad7cac04"
down_revision: Union[str, Sequence[str], None] = "eac1af56085d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Rename workshops to public_events
    op.rename_table("workshops", "public_events")
    op.execute("ALTER INDEX ix_workshops_id RENAME TO ix_public_events_id")

    # Rename memorable_events to posts
    op.rename_table("memorable_events", "posts")
    op.execute("ALTER INDEX ix_memorable_events_id RENAME TO ix_posts_id")

    # Drop legacy events table
    op.drop_table("events")

    # Improvement: Change columns to Text
    op.alter_column(
        "introductions",
        "content",
        existing_type=sa.VARCHAR(),
        type_=sa.Text(),
        existing_nullable=False,
    )
    op.alter_column(
        "projects",
        "description",
        existing_type=sa.VARCHAR(),
        type_=sa.Text(),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "projects",
        "description",
        existing_type=sa.Text(),
        type_=sa.VARCHAR(),
        existing_nullable=True,
    )
    op.alter_column(
        "introductions",
        "content",
        existing_type=sa.Text(),
        type_=sa.VARCHAR(),
        existing_nullable=False,
    )

    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(length=255), autoincrement=False, nullable=False),
        sa.Column("description", sa.Text(), autoincrement=False, nullable=True),
        sa.Column(
            "location", sa.String(length=255), autoincrement=False, nullable=True
        ),
        sa.Column("event_type", sa.String(), autoincrement=False, nullable=False),
        sa.Column("img_url", sa.String(), autoincrement=False, nullable=True),
        sa.Column("events_date", sa.DateTime(), autoincrement=False, nullable=True),
        sa.Column("register_link", sa.String(), autoincrement=False, nullable=True),
        sa.Column("hashtag", sa.String(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint("id", name="events_pkey"),
    )

    op.execute("ALTER INDEX ix_posts_id RENAME TO ix_memorable_events_id")
    op.rename_table("posts", "memorable_events")

    op.execute("ALTER INDEX ix_public_events_id RENAME TO ix_workshops_id")
    op.rename_table("public_events", "workshops")
