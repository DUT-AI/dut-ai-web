from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import Blog
from sqlalchemy import func, extract
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

    def get_most_viewed_in_latest_month(self, limit: int = 5):
        """Lấy blogs có views cao nhất trong tháng mới nhất."""
        # Tìm tháng/năm của blog mới nhất
        latest_blog = self.db.query(Blog).order_by(Blog.created_at.desc()).first()
        if not latest_blog:
            return []

        latest_month = latest_blog.created_at.month
        latest_year = latest_blog.created_at.year

        return (
            self.db.query(Blog)
            .filter(
                extract("month", Blog.created_at) == latest_month,
                extract("year", Blog.created_at) == latest_year,
            )
            .order_by(Blog.views.desc())
            .limit(limit)
            .all()
        )

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

    def get_related_blogs(self, blog_id: int, limit: int = 5):
        """Tìm bài viết liên quan dựa trên PostgreSQL Full-Text Search."""
        current_blog = self.get_by_id(blog_id)
        if not current_blog:
            return []

        # Tạo tsquery từ title + keywords của blog hiện tại
        search_terms = current_blog.title or ""
        if current_blog.keywords:
            search_terms += " " + current_blog.keywords.replace(",", " ")

        # Loại bỏ ký tự đặc biệt, tách từ, nối bằng |
        import re
        words = re.findall(r'\w+', search_terms)
        if not words:
            return []
        tsquery_str = " | ".join(words)

        from sqlalchemy import text, literal_column
        query_expr = func.to_tsquery("simple", tsquery_str)

        results = (
            self.db.query(Blog)
            .filter(Blog.id != blog_id)
            .filter(Blog.search_vector.isnot(None))
            .filter(Blog.search_vector.op("@@")(query_expr))
            .order_by(func.ts_rank(Blog.search_vector, query_expr).desc())
            .limit(limit)
            .all()
        )

        # Fallback: nếu FTS không tìm được, dùng keyword matching
        if not results and current_blog.keywords:
            from sqlalchemy import or_
            keywords = [k.strip() for k in current_blog.keywords.split(",")]
            keyword_filters = [Blog.keywords.ilike(f"%{kw}%") for kw in keywords if kw]
            if keyword_filters:
                results = (
                    self.db.query(Blog)
                    .filter(Blog.id != blog_id)
                    .filter(or_(*keyword_filters))
                    .limit(limit)
                    .all()
                )

        return results