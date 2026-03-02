from datetime import datetime
from typing import List, Optional

from app.v1.keywords.schema import KeywordResponse
from pydantic import BaseModel, ConfigDict


# Author object embedded in BlogResponse
class AuthorBrief(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# Base class chứa các trường chung
class BlogBase(BaseModel):
    title: str
    summary: Optional[str] = None
    content: str
    image_url: Optional[str] = None


# Schema để tạo mới
class BlogCreate(BlogBase):
    author_ids: List[int] = []
    keywords: List[str] = []


# Schema để cập nhật
class BlogUpdate(BlogBase):
    author_ids: Optional[List[int]] = None
    keywords: Optional[List[str]] = None


# Schema để trả về
class BlogResponse(BlogBase):
    id: int
    slug: Optional[str] = None
    views: int
    authors: List[AuthorBrief] = []
    keywords: List[KeywordResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Schema chi tiết với bài viết liên quan
class BlogDetailResponse(BlogResponse):
    related_blogs: list["BlogResponse"] = []


class AuthorStatsResponse(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None
    total_views: int
    post_count: int

    class Config:
        from_attributes = True
