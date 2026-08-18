from fastapi import Depends
from sqlalchemy.orm import Session

from .database import get_db
from .repository_factory import RepositoryFactory
from .service_factory import ServiceFactory
from app.v1.media.service import MinioService


def get_minio_service() -> MinioService:
    """FastAPI dependency: cung cấp MinioService."""
    return MinioService()


def get_repo_factory(db: Session = Depends(get_db)) -> RepositoryFactory:
    """FastAPI dependency: tạo RepositoryFactory với db session hiện tại."""
    return RepositoryFactory(db)


def get_service_factory(
    repo_factory: RepositoryFactory = Depends(get_repo_factory),
) -> ServiceFactory:
    """FastAPI dependency: tạo ServiceFactory.

    Đây là dependency chính dùng trong tất cả routers.
    Chỉ cần `Depends(get_service_factory)` là có toàn bộ services.
    """
    return ServiceFactory(repo_factory)
