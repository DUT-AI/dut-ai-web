from typing import Dict
from app.v1.blogs.models import Blog
from app.v1.users.models import User
from app.v1.projects.models import Project
from app.v1.keywords.models import Keyword


class AdminService:
    def __init__(self, service_factory):
        self._factory = service_factory

    def get_dashboard_stats(self) -> Dict[str, int]:
        """Lấy thông tin thống kê tổng quan cho dashboard."""
        db = self._factory.db
        return {
            "blogs": db.query(Blog).count(),
            "users": db.query(User).count(),
            "projects": db.query(Project).count(),
            "keywords": db.query(Keyword).count(),
        }
