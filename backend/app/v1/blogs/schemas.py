from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class KeywordBase(BaseModel):
    keyword_name: str


class KeywordCreate(KeywordBase):
    pass


class KeywordUpdate(KeywordBase):
    pass


class KeywordResponse(KeywordBase):
    id: int
    number_blog_contain: int

    class Config:
        from_attributes = True


# Base class chứa các trường chung
class BlogBase(BaseModel):
    title: str
    content: str
    authors: Optional[str] = None
    keywords: Optional[List[str]] = None
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
    keywords: List[KeywordResponse] = []
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

    class Config:
        from_attributes = True
