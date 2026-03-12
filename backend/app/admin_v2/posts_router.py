from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from typing import Optional, List

from app.core.dependencies import get_service_factory
from app.v1.posts.schemas import PostCreate, PostUpdate

router = APIRouter(prefix="/admin_v2", tags=["Admin V2"])
templates = Jinja2Templates(directory="app/templates")


def _clean_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    value = value.strip()
    return value if value else None


def _parse_img_urls(raw: Optional[str]) -> List[str]:
    if not raw:
        return []
    lines = [x.strip() for x in raw.splitlines()]
    return [x for x in lines if x]


@router.get("/posts", response_class=HTMLResponse)
async def admin_posts_list(request: Request, service_factory=Depends(get_service_factory)):

    posts = service_factory.post.get_all()
    return templates.TemplateResponse(
        "admin_v2/posts/list.html",
        {"request": request, "posts": posts, "active_page": "posts", "page_title": "Quản lý Posts"},
    )


@router.get("/posts/create", response_class=HTMLResponse)
async def admin_posts_create(request: Request, service_factory=Depends(get_service_factory)):

    return templates.TemplateResponse(
        "admin_v2/posts/edit.html",
        {"request": request, "post": None, "active_page": "posts", "img_urls_text": ""},
    )


@router.get("/posts/edit/{post_id}", response_class=HTMLResponse)
async def admin_posts_edit(post_id: int, request: Request, service_factory=Depends(get_service_factory)):

    post = service_factory.post.get_by_id(post_id)
    img_urls = getattr(post, "img_urls", None) or []
    img_urls_text = "\n".join(img_urls) if isinstance(img_urls, list) else str(img_urls)
    return templates.TemplateResponse(
        "admin_v2/posts/edit.html",
        {"request": request, "post": post, "active_page": "posts", "img_urls_text": img_urls_text},
    )


@router.post("/posts/save")
async def admin_posts_save(
    request: Request,
    id: Optional[int] = Form(None),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    summary: Optional[str] = Form(None),
    img_urls_text: Optional[str] = Form(None),
    hashtag: Optional[str] = Form(None),
    events_date: Optional[str] = Form(None),
    facebook_url: Optional[str] = Form(None),
    service_factory=Depends(get_service_factory),
):

    data = {
        "title": title.strip(),
        "description": _clean_text(description),
        "summary": _clean_text(summary),
        "img_urls": _parse_img_urls(img_urls_text),
        "hashtag": _clean_text(hashtag),
        "events_date": _clean_text(events_date),
        "facebook_url": _clean_text(facebook_url),
    }

    if id:
        service_factory.post.update(id, PostUpdate(**data))
    else:
        service_factory.post.create(PostCreate(**data))

    return RedirectResponse(url="/admin_v2/posts", status_code=303)


@router.post("/posts/delete/{post_id}")
async def admin_posts_delete(post_id: int, service_factory=Depends(get_service_factory)):
    service_factory.post.delete(post_id)
    return RedirectResponse(url="/admin_v2/posts", status_code=303)