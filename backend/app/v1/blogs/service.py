from app.core.base_service import BaseService
from .repository import BlogRepository
from .models import Blog
from .schemas import BlogCreate, BlogUpdate
from fastapi import HTTPException

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