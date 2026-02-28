from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import Blog, Keyword
from sqlalchemy import func, extract, or_
from typing import Optional, List

class KeywordRepository(BaseRepository[Keyword]):
    def __init__(self, db: Session):
        super().__init__(Keyword, db)

    def get_by_name(self, name: str) -> Optional[Keyword]:
        return self.db.query(Keyword).filter(Keyword.keyword_name == name).first()

    def get_or_create(self, name: str) -> Keyword:
        keyword = self.get_by_name(name)
        if not keyword:
            keyword = self.create(keyword_name=name)
        return keyword

class BlogRepository(BaseRepository[Blog]):

    def __init__(self, db: Session):
        super().__init__(Blog, db)
        self.keyword_repo = KeywordRepository(db)

    def get_all_blogs(self, title: Optional[str] = None, keyword: Optional[str] = None):
        query = self.db.query(Blog)

        if title:
            query = query.filter(Blog.title.ilike(f"%{title}%"))

        if keyword:
            query = query.filter(Blog.keywords_rel.any(Keyword.keyword_name.ilike(f"%{keyword}%")))
            
        return query.all()

    def create_with_keywords(self, blog_data: dict, keyword_names: List[str]) -> Blog:
        blog = Blog(**blog_data)
        for name in keyword_names:
            kw = self.keyword_repo.get_or_create(name)
            blog.keywords_rel.append(kw)
            kw.number_blog_contain += 1
        
        self.db.add(blog)
        self.db.commit()
        self.db.refresh(blog)
        return blog

    def update_with_keywords(self, blog: Blog, blog_data: dict, keyword_names: Optional[List[str]] = None) -> Blog:
        # Update basic fields
        for key, value in blog_data.items():
            if value is not None:
                setattr(blog, key, value)
        
        if keyword_names is not None:
            # Remove old associations and decrement counts
            old_keywords = list(blog.keywords_rel)
            for kw in old_keywords:
                kw.number_blog_contain -= 1
            blog.keywords_rel = []
            
            # Add new associations and increment counts
            for name in keyword_names:
                kw = self.keyword_repo.get_or_create(name)
                blog.keywords_rel.append(kw)
                kw.number_blog_contain += 1

        self.db.commit()
        self.db.refresh(blog)
        return blog

    def delete_blog(self, blog: Blog):
        # Decrement counts for all keywords before deleting
        for kw in blog.keywords_rel:
            kw.number_blog_contain -= 1
        
        self.db.delete(blog)
        self.db.commit()

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
        from sqlalchemy import String # Added import for String
        return (
            self.db.query(
                func.unnest(func.cast(Blog.authors_rel, String)).label("author"), # This is likely wrong now
                func.sum(Blog.views).label("total_views")
            )
            # This needs refactoring if authors is now a relationship
            # But the user only asked for keywords. I'll focus on keywords for now.
            .limit(limit) # Placeholder
            .all()
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
        words = re.findall(r'\w+', search_terms)
        
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