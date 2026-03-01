from datetime import datetime
from typing import Optional

from fastapi import HTTPException, UploadFile

from app.core.base_service import BaseService
from app.v1.media.service import MinioService
from .repository import ProjectRepository
from .models import Project, ProjectMember
from .schemas import ProjectCreate, ProjectUpdate, ProjectMemberInfo, ProjectMemberResponse


class ProjectService(BaseService[Project, ProjectCreate, ProjectUpdate]):
    """Project service — kế thừa BaseService, thêm logic upload ảnh & quản lý members."""

    def __init__(self, repo: ProjectRepository, minio: MinioService):
        super().__init__(repo, entity_name="Project")
        self.minio = minio

    async def create_with_image(
        self,
        title: str,
        description: Optional[str] = None,
        image: Optional[UploadFile] = None,
        features: Optional[str] = None,
        technologies: Optional[str] = None,
        demo_url: Optional[str] = None,
        video_url: Optional[str] = None,
        members: Optional[list[ProjectMemberInfo]] = None,
    ) -> Project:
        """Tạo project mới, upload ảnh lên MinIO nếu có."""
        image_url = (
            await self._upload_image(image) if image and image.filename else None
        )

        data = ProjectCreate(
            title=title,
            description=description,
            image_url=image_url,
            features=features,
            technologies=technologies,
            demo_url=demo_url,
            video_url=video_url,
        )
        # Create project (without members field)
        project = self.repo.create(**data.model_dump(exclude={"members"}))

        # Add members if provided
        if members:
            for m in members:
                self.repo.add_member(project.id, m.user_id, m.role)

        # Reload to include members
        return self.repo.get_by_id(project.id)

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

    # --- Member management ---

    def add_member(self, project_id: int, member: ProjectMemberInfo) -> ProjectMemberResponse:
        """Thêm thành viên vào project."""
        # Verify project exists
        self.get_by_id(project_id)
        pm = self.repo.add_member(project_id, member.user_id, member.role)
        return ProjectMemberResponse(
            id=pm.id,
            user_id=pm.user_id,
            user_name=pm.user.name if pm.user else "Unknown",
            user_avatar_url=pm.user.avatar_url if pm.user else None,
            role=pm.role,
        )

    def remove_member(self, project_id: int, member_id: int) -> None:
        """Xoá thành viên khỏi project."""
        self.get_by_id(project_id)  # verify project exists
        if not self.repo.remove_member(member_id):
            raise HTTPException(status_code=404, detail="Member not found")

    def get_members(self, project_id: int) -> list[ProjectMemberResponse]:
        """Lấy danh sách thành viên của project."""
        self.get_by_id(project_id)
        members = self.repo.get_members(project_id)
        return [
            ProjectMemberResponse(
                id=m.id,
                user_id=m.user_id,
                user_name=m.user.name if m.user else "Unknown",
                user_avatar_url=m.user.avatar_url if m.user else None,
                role=m.role,
            )
            for m in members
        ]
