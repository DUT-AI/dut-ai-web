from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Base class chứa các trường chung
class BlogBase(BaseModel):
    title: str
    content: str
    authors: Optional[str] = None
    keywords: Optional[str] = None
    image_url: Optional[str] = None
# Schema để tạo mới
class BlogCreate(BlogBase):
    pass

# Schema để cập nhật
class BlogUpdate(BlogBase):
    pass

# Schema để trả về
class BlogResponse(BlogBase):
    id: int
    views: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Schema chi tiết với bài viết liên quan
class BlogDetailResponse(BlogResponse):
    related_blogs: list[BlogResponse] = []

class AuthorStatsResponse(BaseModel):
    author: str
    total_views: int
    post_count: int
    
    class Config:
        from_attributes = True