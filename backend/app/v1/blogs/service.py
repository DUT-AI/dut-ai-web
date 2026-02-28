from app.core.base_service import BaseService
from .repository import BlogRepository, KeywordRepository
from .models import Blog, Keyword
from .schemas import BlogCreate, BlogUpdate, KeywordCreate, KeywordUpdate
from fastapi import HTTPException
from typing import Optional


class KeywordService(BaseService[Keyword, KeywordCreate, KeywordUpdate]):
    def __init__(self, repo: KeywordRepository):
        super().__init__(repo, entity_name="Keyword")


class BlogService(BaseService[Blog, BlogCreate, BlogUpdate]):
    def __init__(self, repo: BlogRepository):
        super().__init__(repo, entity_name="Blog")

    def get_by_id(self, id: int) -> Blog:
        blog = super().get_by_id(id)
        if not blog:
            raise HTTPException(status_code=404, detail="Không tìm thấy bài viết")

        blog.views += 1

        self.repo.db.commit()
        self.repo.db.refresh(blog)

        return blog

    def create(self, data: BlogCreate) -> Blog:
        data_dict = data.model_dump()
        keyword_names = data_dict.pop("keywords", []) or []
        return self.repo.create_with_keywords(data_dict, keyword_names)

    def update(self, id: int, data: BlogUpdate) -> Blog:
        blog = self.get_by_id(
            id
        )  # This already increments views, maybe use repo.get_by_id directly if don't want view increment on update
        # Actually super().get_by_id(id) in BaseService doesn't increment views.
        # But self.get_by_id(id) in THIS class does.
        # Let's use BaseService's get_by_id to avoid extra view increment
        instance = self.repo.get_by_id(id)
        if not instance:
            raise HTTPException(status_code=404, detail="Không tìm thấy bài viết")

        data_dict = data.model_dump(exclude_unset=True)
        keyword_names = data_dict.pop("keywords", None)
        return self.repo.update_with_keywords(instance, data_dict, keyword_names)

    def delete(self, id: int) -> None:
        blog = self.get_by_id(id)
        self.repo.delete_blog(blog)

    def get_detail_with_related(self, id: int, related_limit: int = 5):
        """Lấy blog detail kèm danh sách bài viết liên quan."""
        blog = self.get_by_id(id)
        related = self.repo.get_related_blogs(id, related_limit)

        from sqlalchemy import inspect

        cols = [
            c.key for c in inspect(blog).mapper.column_attrs if c.key != "search_vector"
        ]

        blog_dict = {c: getattr(blog, c) for c in cols}
        blog_dict["keywords"] = blog.keywords_rel

        return {
            **blog_dict,
            "related_blogs": related,
        }

    def get_all_blogs(self, title: Optional[str] = None, keyword: Optional[str] = None):
        return self.repo.get_all_blogs(title=title, keyword=keyword)

    def get_most_viewed_in_latest_month(self, limit: int = 5):
        return self.repo.get_most_viewed_in_latest_month(limit)

    def get_top_authors(self, limit: int = 5):
        return self.repo.get_top_authors(limit)
