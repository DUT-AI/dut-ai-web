"""create_workshop_and_memorable_event_tables

Revision ID: eac1af56085d
Revises: 1bab2c00b1f7
Create Date: 2026-03-01 01:01:17.672603

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "eac1af56085d"
down_revision: Union[str, Sequence[str], None] = "1bab2c00b1f7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create memorable_events table
    op.create_table(
        "memorable_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("img_url", sa.String(), nullable=True),
        sa.Column("hashtag", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_memorable_events_id"), "memorable_events", ["id"], unique=False
    )

    # Create workshops table
    op.create_table(
        "workshops",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("img_url", sa.String(), nullable=True),
        sa.Column("events_date", sa.DateTime(), nullable=True),
        sa.Column("location", sa.String(), nullable=True),
        sa.Column("register_link", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_workshops_id"), "workshops", ["id"], unique=False)

    # Adjust events table
    # Check if columns already exist before adding (to be safe)
    # op.add_column('events', sa.Column('created_at', sa.DateTime(), nullable=True))
    # op.add_column('events', sa.Column('updated_at', sa.DateTime(), nullable=True))
    # op.drop_column('events', 'event_type')


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_workshops_id"), table_name="workshops")
    op.drop_table("workshops")
    op.drop_index(op.f("ix_memorable_events_id"), table_name="memorable_events")
    op.drop_table("memorable_events")
