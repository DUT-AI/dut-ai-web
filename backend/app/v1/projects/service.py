from datetime import datetime
from typing import Optional

from fastapi import HTTPException, UploadFile

from app.core.base_service import BaseService
from app.v1.media.service import MinioService
from .repository import ProjectRepository
from .models import Project
from .schemas import ProjectCreate, ProjectUpdate


class ProjectService(BaseService[Project, ProjectCreate, ProjectUpdate]):
    """Project service — kế thừa BaseService, thêm logic upload ảnh."""

    def __init__(self, repo: ProjectRepository, minio: MinioService):
        super().__init__(repo, entity_name="Project")
        self.minio = minio

    async def create_with_image(
        self,
        title: str,
        description: Optional[str] = None,
        product_link: Optional[str] = None,
        image: Optional[UploadFile] = None,
    ) -> Project:
        """Tạo project mới, upload ảnh lên MinIO nếu có."""
        image_url = (
            await self._upload_image(image) if image and image.filename else None
        )

        data = ProjectCreate(
            title=title,
            description=description,
            product_link=product_link,
            image_url=image_url,
        )
        return self.repo.create(**data.model_dump())

    async def update_image(self, project_id: int, image: UploadFile) -> Project:
        """Upload/thay đổi ảnh cho project đã có."""
        image_url = await self._upload_image(image)
        if not image_url:
            raise HTTPException(status_code=400, detail="Không thể upload ảnh")

        instance = self.get_by_id(project_id)
        return self.repo.update(instance, image_url=image_url)

    async def _upload_image(self, image: UploadFile) -> Optional[str]:
        """Validate và upload ảnh lên MinIO, trả về URL."""
        if not image or not image.filename:
            return None

        file_data = await image.read()
        error = self.minio.validate_image(image.filename, len(file_data))
        if error:
            raise HTTPException(status_code=400, detail=error)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        object_name = f"projects/{timestamp}_{image.filename}"
        return self.minio.upload_file(
            file_data=file_data,
            filename=object_name,
            content_type=image.content_type or "image/png",
        )
