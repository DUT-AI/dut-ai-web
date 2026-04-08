from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from typing import List, Optional

from app.core.dependencies import get_service_factory
from app.v1.blogs.schemas import BlogCreate, BlogUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])
templates = Jinja2Templates(directory="app/templates")


@router.get("/blogs", response_class=HTMLResponse)
async def admin_blogs_list(
    request: Request, service_factory=Depends(get_service_factory)
):
    blogs = service_factory.blog.repo.get_all_blogs()
    return templates.TemplateResponse(
        "admin/blogs/list.html",
        {
            "request": request,
            "blogs": blogs,
            "active_page": "blogs",
            "page_title": "Quản lý bài viết",
        },
    )


@router.get("/blogs/create", response_class=HTMLResponse)
async def admin_blogs_create(
    request: Request, service_factory=Depends(get_service_factory)
):
    all_authors = service_factory.user.get_all()
    all_keywords = service_factory.keyword.get_all()
    return templates.TemplateResponse(
        "admin/blogs/edit.html",
        {
            "request": request,
            "blog": None,
            "all_authors": all_authors,
            "all_keywords": all_keywords,
            "active_page": "blogs",
        },
    )


@router.get("/blogs/edit/{blog_id}", response_class=HTMLResponse)
async def admin_blogs_edit(
    blog_id: int, request: Request, service_factory=Depends(get_service_factory)
):
    blog = service_factory.blog.get_by_id(blog_id)
    all_authors = service_factory.user.get_all()
    all_keywords = service_factory.keyword.get_all()
    return templates.TemplateResponse(
        "admin/blogs/edit.html",
        {
            "request": request,
            "blog": blog,
            "all_authors": all_authors,
            "all_keywords": all_keywords,
            "active_page": "blogs",
        },
    )


@router.post("/blogs/save")
async def admin_blogs_save(
    request: Request,
    id: Optional[int] = Form(None),
    title: str = Form(...),
    content: str = Form(...),
    summary: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    author_ids: List[int] = Form([]),
    keyword_tags: List[str] = Form([]),
    service_factory=Depends(get_service_factory),
):
    blog_data = {
        "title": title.strip(),
        "content": content.strip(),
        "summary": summary,
        "image_url": image_url,
        "author_ids": author_ids,
        "keywords": keyword_tags,
    }

    if id:
        service_factory.blog.update(id, BlogUpdate(**blog_data))
    else:
        service_factory.blog.create(BlogCreate(**blog_data))

    return RedirectResponse(url="/admin/blogs", status_code=303)


@router.post("/blogs/delete/{blog_id}")
async def admin_blogs_delete(
    blog_id: int, service_factory=Depends(get_service_factory)
):
    service_factory.blog.delete(blog_id)
    return RedirectResponse(url="/admin/blogs", status_code=303)