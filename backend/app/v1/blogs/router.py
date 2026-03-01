from typing import Optional

from app.core.dependencies import get_service_factory
from fastapi import APIRouter, Depends, Query

from .schemas import AuthorStatsResponse, BlogDetailResponse, BlogResponse

router = APIRouter(prefix="/blogs", tags=["Blogs"])


@router.get("/", response_model=list[BlogResponse])
def get_blogs(
    title: Optional[str] = Query(None, description="Tìm theo tiêu đề bài viết"),
    keyword: Optional[str] = Query(None, description="Tìm theo từ khóa (keywords)"),
    service_factory=Depends(get_service_factory),
):
    return service_factory.blog.get_all_blogs(title=title, keyword=keyword)


@router.get("/top-viewed", response_model=list[BlogResponse])
def get_most_viewed_in_latest_month(
    limit: int = Query(5, description="Số lượng bài muốn lấy"),
    service_factory=Depends(get_service_factory),
):
    return service_factory.blog.get_most_viewed_in_latest_month(limit)


@router.get("/top-authors", response_model=list[AuthorStatsResponse])
def get_top_authors(
    limit: int = Query(5, description="Số lượng tác giả muốn lấy"),
    service_factory=Depends(get_service_factory),
):
    return service_factory.blog.get_top_authors(limit)


@router.get("/{id}", response_model=BlogDetailResponse)
def get_blog(id: int, service_factory=Depends(get_service_factory)):
    return service_factory.blog.get_detail_with_related(id)
