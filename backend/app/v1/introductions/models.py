from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Introduction(Base):
    __tablename__ = "introductions"

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
