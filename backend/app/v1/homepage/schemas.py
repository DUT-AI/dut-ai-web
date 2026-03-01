from pydantic import BaseModel

from app.v1.projects.schemas import ProjectResponse
from app.v1.public_events.schemas import PublicEventResponse
from app.v1.blogs.schemas import BlogResponse


class HomepageResponse(BaseModel):
    """Response tổng hợp cho trang chủ."""

    latest_projects: list[ProjectResponse]
    latest_events: list[PublicEventResponse]
    latest_blogs: list[BlogResponse]
