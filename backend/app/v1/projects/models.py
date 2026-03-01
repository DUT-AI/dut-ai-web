from sqlalchemy import Text, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.core.mixins import HasImageUpload

# Để SQLAlchemy tìm thấy User class
from app.v1.users.models import User


class ProjectMember(Base):
    """Bảng trung gian: mỗi hàng = 1 user + 1 role trong project."""

    __tablename__ = "project_members"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    role: Mapped[str] = mapped_column(String, nullable=False)

    project = relationship("Project", back_populates="members")
    user = relationship("User", lazy="joined")

    @property
    def user_name(self) -> str:
        return self.user.name if self.user else "Unknown"

    @property
    def user_avatar_url(self):
        return self.user.avatar_url if self.user else None

    def __str__(self):
        return f"{self.user.name} ({self.role})" if self.user else self.role


class Project(Base, HasImageUpload):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(nullable=True)
    features: Mapped[str] = mapped_column(Text, nullable=True)
    technologies: Mapped[str] = mapped_column(Text, nullable=True)
    demo_url: Mapped[str] = mapped_column(nullable=True)
    video_url: Mapped[str] = mapped_column(nullable=True)

    # Quan hệ 1-N với ProjectMember
    members = relationship(
        "ProjectMember", back_populates="project", cascade="all, delete-orphan", lazy="joined"
    )

    def __str__(self):
        return self.title
