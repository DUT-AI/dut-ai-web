from app.core.base_service import BaseService
from .repository import BlogRepository
from .models import Blog
from .schemas import BlogCreate, BlogUpdate
from fastapi import HTTPException
from typing import Optional

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
    def get_all_blogs(self, title: Optional[str] = None, keyword: Optional[str] = None):
        return self.repo.get_all_blogs(title=title, keyword=keyword)

    def get_top_viewed(self, limit: int = 5):
        return self.repo.get_top_viewed(limit)

    def get_top_authors(self, limit: int = 5):
        return self.repo.get_top_authors(limit)