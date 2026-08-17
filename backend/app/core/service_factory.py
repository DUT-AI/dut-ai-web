from sqlalchemy.orm import Session
from app.v1.media.service import MinioService
from .repository_factory import RepositoryFactory


class ServiceFactory:
    """Factory để tạo và cache các Service instances."""

    def __init__(self, repo_factory: RepositoryFactory):
        self._repo = repo_factory
        self._cache: dict = {}

    @property
    def db(self) -> Session:
        return self._repo.db

    @property
    def media(self) -> MinioService:
        if "media" not in self._cache:
            self._cache["media"] = MinioService()
        return self._cache["media"]
