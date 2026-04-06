import ast
import re
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Request, Depends, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app.core.dependencies import get_service_factory
from app.v1.posts.schemas import PostCreate, PostUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])
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


def _normalize_datetime_input(value: Optional[str]):
    raw = _clean_text(value)
    if not raw:
        return None

    raw = raw.replace("T", " ")

    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", raw):
        return datetime.strptime(raw, "%Y-%m-%d").date()

    m = re.fullmatch(r"(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})(?::(\d{1,2}))?", raw)
    if m:
        d, hh, mm, ss = m.groups()
        ss = (ss or "00").zfill(2)
        return datetime.strptime(f"{d} {hh}:{mm}:{ss}", "%Y-%m-%d %H:%M:%S")

    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d %H:%M:%S.%f"):
        try:
            return datetime.strptime(raw, fmt)
        except ValueError:
            pass

    raise HTTPException(
        status_code=400,
        detail="events_date không đúng định dạng. Ví dụ hợp lệ: 2026-02-26 hoặc 2026-02-26 12:00:00",
    )


def _first_image_from_any(value) -> Optional[str]:
    if not value:
        return None

    if isinstance(value, list):
        return value[0] if value else None

    if isinstance(value, str):
        raw = value.strip()
        if not raw:
            return None

        if raw.startswith("[") and raw.endswith("]"):
            try:
                parsed = ast.literal_eval(raw)
                if isinstance(parsed, list) and parsed:
                    return parsed[0]
            except Exception:
                pass

        lines = [x.strip() for x in raw.splitlines() if x.strip()]
        return lines[0] if lines else None

    return None


@router.get("/posts", response_class=HTMLResponse)
async def admin_posts_list(request: Request, service_factory=Depends(get_service_factory)):
    posts = service_factory.post.get_all()

    for p in posts:
        p.thumbnail_url = _first_image_from_any(getattr(p, "img_urls", None))

    return templates.TemplateResponse(
        "admin/posts/list.html",
        {
            "request": request,
            "posts": posts,
            "active_page": "posts",
            "page_title": "Quản lý Posts",
        },
    )


@router.get("/posts/create", response_class=HTMLResponse)
async def admin_posts_create(request: Request, service_factory=Depends(get_service_factory)):
    return templates.TemplateResponse(
        "admin/posts/edit.html",
        {
            "request": request,
            "post": None,
            "active_page": "posts",
            "img_urls_text": "",
        },
    )


@router.get("/posts/edit/{post_id}", response_class=HTMLResponse)
async def admin_posts_edit(post_id: int, request: Request, service_factory=Depends(get_service_factory)):
    post = service_factory.post.get_by_id(post_id)
    img_urls = getattr(post, "img_urls", None) or []

    if isinstance(img_urls, list):
        img_urls_text = "\n".join(img_urls)
    elif isinstance(img_urls, str) and img_urls.startswith("[") and img_urls.endswith("]"):
        try:
            parsed = ast.literal_eval(img_urls)
            img_urls_text = "\n".join(parsed) if isinstance(parsed, list) else str(img_urls)
        except Exception:
            img_urls_text = str(img_urls)
    else:
        img_urls_text = str(img_urls)

    return templates.TemplateResponse(
        "admin/posts/edit.html",
        {
            "request": request,
            "post": post,
            "active_page": "posts",
            "img_urls_text": img_urls_text,
        },
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
        "events_date": _normalize_datetime_input(events_date),
        "facebook_url": _clean_text(facebook_url),
    }

    if id:
        service_factory.post.update(id, PostUpdate(**data))
    else:
        service_factory.post.create(PostCreate(**data))

    return RedirectResponse(url="/admin/posts", status_code=303)


@router.post("/posts/delete/{post_id}")
async def admin_posts_delete(post_id: int, service_factory=Depends(get_service_factory)):
    service_factory.post.delete(post_id)
    return RedirectResponse(url="/admin/posts", status_code=303)