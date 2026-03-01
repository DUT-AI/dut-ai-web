from pydantic import BaseModel, ConfigDict
from typing import Optional


# --- Member schemas ---

class ProjectMemberInfo(BaseModel):
    """Dùng khi tạo/thêm member: chỉ cần user_id + role."""

    user_id: int
    role: str


class ProjectMemberResponse(BaseModel):
    """Response: kèm thông tin user."""

    id: int
    user_id: int
    user_name: str
    user_avatar_url: Optional[str] = None
    role: str

    model_config = ConfigDict(from_attributes=True)


# --- Project schemas ---

class ProjectBase(BaseModel):
    """Fields chung — chỉ khai báo 1 lần."""

    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    features: Optional[str] = None
    technologies: Optional[str] = None
    demo_url: Optional[str] = None
    video_url: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Tạo mới: bắt buộc title, còn lại optional."""

    members: Optional[list[ProjectMemberInfo]] = None


class ProjectUpdate(BaseModel):
    """Cập nhật: tất cả optional."""

    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    features: Optional[str] = None
    technologies: Optional[str] = None
    demo_url: Optional[str] = None
    video_url: Optional[str] = None


class ProjectResponse(ProjectBase):
    """Response: thêm id + members."""

    id: int
    members: list[ProjectMemberResponse] = []

    model_config = ConfigDict(from_attributes=True)
