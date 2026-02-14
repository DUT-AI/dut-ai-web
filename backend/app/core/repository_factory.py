from sqlalchemy.orm import Session

from app.v1.projects.repository import ProjectRepository
from app.v1.introductions.repository import IntroductionRepository


class RepositoryFactory:
    """Factory để tạo và cache các Repository instances.

    Tất cả repositories chia sẻ cùng 1 db session trong mỗi request.
    """

    def __init__(self, db: Session):
        self._db = db
        self._cache: dict = {}

    @property
    def project(self) -> ProjectRepository:
        if "project" not in self._cache:
            self._cache["project"] = ProjectRepository(self._db)
        return self._cache["project"]

    @property
    def introduction(self) -> IntroductionRepository:
        if "introduction" not in self._cache:
            self._cache["introduction"] = IntroductionRepository(self._db)
        return self._cache["introduction"]
