from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    product_link: Mapped[str] = mapped_column(nullable=True)
    image_url: Mapped[str] = mapped_column(nullable=True)
