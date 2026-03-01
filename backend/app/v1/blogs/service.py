from typing import Optional

from app.core.base_service import BaseService
from fastapi import HTTPException

from .models import Blog
from .repository import BlogRepository
from .schemas import BlogCreate, BlogUpdate


class BlogService(BaseService[Blog, BlogCreate, BlogUpdate]):
    def __init__(self, repo: BlogRepository, service_factory):
        super().__init__(repo, entity_name="Blog")
        self._factory = service_factory

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

        blog = self.repo.model(**data_dict)
        for name in keyword_names:
            kw = self._factory.keyword.repo.get_or_create(name)
            blog.keywords_rel.append(kw)

        self.repo.db.add(blog)
        self.repo.db.commit()
        self.repo.db.refresh(blog)
        return blog

    def update(self, id: int, data: BlogUpdate) -> Blog:
        instance = self.repo.get_by_id(id)
        if not instance:
            raise HTTPException(status_code=404, detail="Không tìm thấy bài viết")

        data_dict = data.model_dump(exclude_unset=True)
        keyword_names = data_dict.pop("keywords", None)

        # Update basic fields
        for key, value in data_dict.items():
            setattr(instance, key, value)

        if keyword_names is not None:
            # Remove old associations
            instance.keywords_rel = []

            # Add new associations
            for name in keyword_names:
                kw = self._factory.keyword.repo.get_or_create(name)
                instance.keywords_rel.append(kw)

        self.repo.db.commit()
        self.repo.db.refresh(instance)
        return instance

    def delete(self, id: int) -> None:
        blog = self.get_by_id(id)
        self.repo.delete(blog)

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

    def get_all_blogs(
        self,
        title: Optional[str] = None,
        keyword: Optional[str] = None,
        limit: Optional[int] = None,
    ):
        # We need to update repository to support limit if we want to use it in Homepage
        # For now let's just use slicing if limit is provided
        blogs = self.repo.get_all_blogs(title=title, keyword=keyword)
        if limit:
            return blogs[:limit]
        return blogs

    def get_most_viewed_in_latest_month(self, limit: int = 5):
        return self.repo.get_most_viewed_in_latest_month(limit)

    def get_top_authors(self, limit: int = 5):
        return self.repo.get_top_authors(limit)
