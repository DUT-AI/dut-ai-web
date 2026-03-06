from typing import Optional

from app.core.base_repository import BaseRepository
from app.v1.users.models import User
from sqlalchemy import String, extract, func, text
from sqlalchemy.orm import Session, joinedload

from .models import Blog, Keyword, blog_authors


class BlogRepository(BaseRepository[Blog]):

    def __init__(self, db: Session):
        super().__init__(Blog, db)

    def get_by_slug(self, slug: str):
        return (
            self.db.query(Blog)
            .options(joinedload(Blog.authors_rel), joinedload(Blog.keywords_rel))
            .filter(Blog.slug == slug)
            .first()
        )

    def get_all_blogs(self, title: Optional[str] = None, keyword: Optional[str] = None):
        query = self.db.query(Blog).options(
            joinedload(Blog.authors_rel),
            joinedload(Blog.keywords_rel),
        )

        if title:
            query = query.filter(Blog.title.ilike(f"%{title}%"))

        if keyword:
            query = query.filter(
                Blog.keywords_rel.any(Keyword.keyword_name.ilike(f"%{keyword}%"))
            )

        return query.order_by(Blog.created_at.desc()).all()

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
            .options(
                joinedload(Blog.authors_rel),
                joinedload(Blog.keywords_rel),
            )
            .filter(
                extract("month", Blog.created_at) == latest_month,
                extract("year", Blog.created_at) == latest_year,
            )
            .order_by(Blog.views.desc())
            .limit(limit)
            .all()
        )

    def get_top_authors(self, limit: int = 5):
        """Lấy top tác giả theo tổng views qua bảng blog_authors join."""

        results = (
            self.db.query(
                User,
                func.sum(Blog.views).label("total_views"),
                func.count(Blog.id).label("post_count"),
            )
            .join(blog_authors, User.id == blog_authors.c.user_id)
            .join(Blog, Blog.id == blog_authors.c.blog_id)
            .group_by(User.id)
            .order_by(text("total_views DESC"))
            .limit(limit)
            .all()
        )
        # Chuyển đổi sang format AuthorStats
        return [
            {
                "id": author.id,
                "name": author.name,
                "avatar_url": getattr(author, "avatar_url", None),
                "total_views": total_views,
                "post_count": post_count,
            }
            for author, total_views, post_count in results
        ]

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
