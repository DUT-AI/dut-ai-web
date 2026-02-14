from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import Project


class ProjectRepository(BaseRepository[Project]):
    """Project repository — kế thừa toàn bộ CRUD từ BaseRepository.

    Thêm custom query ở đây nếu cần, ví dụ:
        def get_by_title(self, title: str) -> Project | None:
            return self.db.query(self.model).filter(self.model.title == title).first()
    """

    def __init__(self, db: Session):
        super().__init__(Project, db)
