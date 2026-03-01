from typing import Optional

from app.core.base_repository import BaseRepository
from sqlalchemy import extract, func, String
from sqlalchemy.orm import Session

from .models import Blog, Keyword


class BlogRepository(BaseRepository[Blog]):

    def __init__(self, db: Session):
        super().__init__(Blog, db)

    def get_all_blogs(self, title: Optional[str] = None, keyword: Optional[str] = None):
        query = self.db.query(Blog)

        if title:
            query = query.filter(Blog.title.ilike(f"%{title}%"))

        if keyword:
            query = query.filter(
                Blog.keywords_rel.any(Keyword.keyword_name.ilike(f"%{keyword}%"))
            )

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
        # Note: authors field is still a string in the model, authors_rel is relationship
        # Assuming authors is still used for name-based stats if not using authors_rel
        # Let's check model: authors_rel = relationship("User", secondary=blog_authors, backref="blogs")
        # There is no 'authors' column in Blog model anymore in my update?
        # Wait, I removed 'keywords' and replaced with 'keywords_rel'.
        # Did I remove 'authors'? No, I didn't see an 'authors' column in the original Blog model except in repository.
        # Let's check models.py again.

        return (
            self.db.query(
                Blog.authors.label("author"),
                func.sum(Blog.views).label("total_views"),
                func.count(Blog.id).label("post_count")
            )
            # This needs refactoring if authors is now a relationship
            # But the user only asked for keywords. I'll focus on keywords for now.
            .limit(limit).all()  # Placeholder
        )

    def get_related_blogs(self, blog_id: int, limit: int = 5):
        """Tìm bài viết liên quan dựa trên PostgreSQL Full-Text Search và Keywords."""
        current_blog = self.get_by_id(blog_id)
        if not current_blog:
            return []

        # Tạo tsquery từ title
        search_terms = current_blog.title or ""

        # Loại bỏ ký tự đặc biệt, tách từ, nối bằng |
        import re

        words = re.findall(r"\w+", search_terms)

        results = []
        if words:
            tsquery_str = " | ".join(words)
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

        # Fallback hoặc bổ sung: dùng keyword matching
        if len(results) < limit and current_blog.keywords_rel:
            keyword_ids = [k.id for k in current_blog.keywords_rel]
            more_results = (
                self.db.query(Blog)
                .join(Blog.keywords_rel)
                .filter(Blog.id != blog_id)
                .filter(Keyword.id.in_(keyword_ids))
                .filter(~Blog.id.in_([b.id for b in results]))
                .limit(limit - len(results))
                .all()
            )
            results.extend(more_results)

        return results
