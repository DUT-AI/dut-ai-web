from sqlalchemy.orm import Session, joinedload
from app.core.base_repository import BaseRepository
from .models import Project, ProjectMember


class ProjectRepository(BaseRepository[Project]):
    """Project repository — kế thừa CRUD từ BaseRepository, thêm member management."""

    def __init__(self, db: Session):
        super().__init__(Project, db)

    def get_by_id(self, id: int) -> Project | None:
        """Override để eager-load members + user."""
        return (
            self.db.query(Project)
            .options(joinedload(Project.members).joinedload(ProjectMember.user))
            .filter(Project.id == id)
            .first()
        )

    def get_all(self) -> list[Project]:
        """Override để eager-load members + user."""
        return (
            self.db.query(Project)
            .options(joinedload(Project.members).joinedload(ProjectMember.user))
            .all()
        )

    # --- Member management ---

    def add_member(self, project_id: int, user_id: int, role: str) -> ProjectMember:
        member = ProjectMember(project_id=project_id, user_id=user_id, role=role)
        self.db.add(member)
        self.db.commit()
        self.db.refresh(member)
        return member

    def remove_member(self, member_id: int) -> bool:
        member = self.db.query(ProjectMember).filter(ProjectMember.id == member_id).first()
        if not member:
            return False
        self.db.delete(member)
        self.db.commit()
        return True

    def get_members(self, project_id: int) -> list[ProjectMember]:
        return (
            self.db.query(ProjectMember)
            .options(joinedload(ProjectMember.user))
            .filter(ProjectMember.project_id == project_id)
            .all()
        )
