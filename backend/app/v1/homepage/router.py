from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.v1.projects.models import Project
from app.v1.events.models import Event
from app.v1.blogs.models import Blog
from .schemas import HomepageResponse

router = APIRouter(prefix="/homepage", tags=["Homepage"])


@router.get("", response_model=HomepageResponse)
def get_homepage(
    limit: int = Query(default=5, ge=1, le=20, description="Số lượng items mỗi loại"),
    db: Session = Depends(get_db),
):
    """Trả về dữ liệu trang chủ: k project, event, blog mới nhất."""

    latest_projects = (
        db.query(Project).order_by(Project.id.desc()).limit(limit).all()
    )

    latest_events = (
        db.query(Event).order_by(Event.event_date.desc()).limit(limit).all()
    )

    latest_blogs = (
        db.query(Blog).order_by(Blog.created_at.desc()).limit(limit).all()
    )

    return HomepageResponse(
        latest_projects=latest_projects,
        latest_events=latest_events,
        latest_blogs=latest_blogs,
    )
