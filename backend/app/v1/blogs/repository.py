from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import Blog
from sqlalchemy import func
from typing import Optional

class BlogRepository(BaseRepository[Blog]):

    def __init__(self, db: Session):
        super().__init__(Blog, db)
    def get_all_blogs(self, title: Optional[str] = None, keyword: Optional[str] = None):
        query = self.db.query(Blog)

        if title:
            query = query.filter(Blog.title.ilike(f"%{title}%"))

        if keyword:
            query = query.filter(Blog.keywords.ilike(f"%{keyword}%"))
            
        return query.all()

    def get_top_viewed(self, limit: int = 5):
        return self.db.query(Blog).order_by(Blog.views.desc()).limit(limit).all()

    def get_top_authors(self, limit: int = 5):
        return (
            self.db.query(
                Blog.authors.label("author"),
                func.sum(Blog.views).label("total_views")
            )
            .filter(Blog.authors.isnot(None))
            .group_by(Blog.authors)
            .order_by(func.sum(Blog.views).desc())
            .limit(limit)
            .all()
        )