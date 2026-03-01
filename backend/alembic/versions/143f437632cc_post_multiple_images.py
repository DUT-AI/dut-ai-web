"""post_multiple_images

Revision ID: 143f437632cc
Revises: 9353ad7cac04
Create Date: 2026-03-01 01:43:17.203150

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "143f437632cc"
down_revision: Union[str, Sequence[str], None] = "9353ad7cac04"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Rename and change type with data conversion
    op.execute("ALTER TABLE posts RENAME COLUMN img_url TO img_urls")
    op.execute(
        "ALTER TABLE posts ALTER COLUMN img_urls TYPE varchar[] USING string_to_array(img_urls, E'\\n')"
    )


def downgrade() -> None:
    # Reverse conversion
    op.execute(
        "ALTER TABLE posts ALTER COLUMN img_urls TYPE varchar USING array_to_string(img_urls, E'\\n')"
    )
    op.execute("ALTER TABLE posts RENAME COLUMN img_urls TO img_url")
