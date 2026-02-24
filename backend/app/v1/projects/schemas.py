from pydantic import BaseModel
from typing import Optional


class ProjectBase(BaseModel):
    """Fields chung — chỉ khai báo 1 lần."""

    title: str
    description: Optional[str] = None
    product_link: Optional[str] = None
    image_url: Optional[str] = None
    project_url: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Tạo mới: bắt buộc title, còn lại optional (kế thừa từ Base)."""


class ProjectUpdate(BaseModel):
    """Cập nhật: tất cả optional."""

    title: Optional[str] = None
    description: Optional[str] = None
    product_link: Optional[str] = None
    image_url: Optional[str] = None
    project_url: Optional[str] = None

class ProjectResponse(ProjectBase):
    """Response: thêm id, kế thừa toàn bộ fields từ Base."""

    id: int

    model_config = {"from_attributes": True}
