from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from typing import List, Optional

from app.core.dependencies import get_service_factory

# Schemas v1 (bạn đảm bảo các schema này tồn tại trong project)
from app.v1.projects.schemas import ProjectCreate, ProjectUpdate
from app.v1.public_events.schemas import PublicEventCreate, PublicEventUpdate
from app.v1.posts.schemas import PostCreate, PostUpdate
from app.v1.keywords.schema import KeywordCreate, KeywordUpdate


router = APIRouter(prefix="/admin_v2", tags=["Admin V2"])
templates = Jinja2Templates(directory="app/templates")


# ---------------------------
# Helpers
# ---------------------------

def _parse_tags(tags_str: Optional[str]) -> List[str]:
    """Nhập tags dạng: 'AI, ML, Event' -> ['AI','ML','Event']"""
    if not tags_str:
        return []
    return [t.strip() for t in tags_str.split(",") if t.strip()]


def _parse_img_urls(raw: Optional[str]) -> List[str]:
    """Nhập nhiều url ảnh, mỗi dòng 1 url."""
    if not raw:
        return []
    lines = [x.strip() for x in raw.splitlines()]
    return [x for x in lines if x]


# ==========================================================
# PROJECTS
# DB: projects(id,title,description,image_url,features,technologies,demo_url,video_url)
# ==========================================================

@router.get("/projects", response_class=HTMLResponse)
async def admin_projects_list(request: Request, service_factory=Depends(get_service_factory)):
    projects = service_factory.project.get_all()
    return templates.TemplateResponse(
        "admin_v2/projects/list.html",
        {
            "request": request,
            "projects": projects,
            "active_page": "projects",
            "page_title": "Quản lý Projects",
        },
    )


@router.get("/projects/create", response_class=HTMLResponse)
async def admin_projects_create(request: Request, service_factory=Depends(get_service_factory)):
    return templates.TemplateResponse(
        "admin_v2/projects/edit.html",
        {
            "request": request,
            "project": None,
            "active_page": "projects",
        },
    )


@router.get("/projects/edit/{project_id}", response_class=HTMLResponse)
async def admin_projects_edit(project_id: int, request: Request, service_factory=Depends(get_service_factory)):
    project = service_factory.project.get_by_id(project_id)
    return templates.TemplateResponse(
        "admin_v2/projects/edit.html",
        {
            "request": request,
            "project": project,
            "active_page": "projects",
        },
    )


@router.post("/projects/save")
async def admin_projects_save(
    request: Request,
    id: Optional[int] = Form(None),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    features: Optional[str] = Form(None),
    technologies: Optional[str] = Form(None),
    demo_url: Optional[str] = Form(None),
    video_url: Optional[str] = Form(None),
    service_factory=Depends(get_service_factory),
):
    data = {
        "title": title,
        "description": description,
        "image_url": image_url,
        "features": features,
        "technologies": technologies,
        "demo_url": demo_url,
        "video_url": video_url,
    }

    if id:
        service_factory.project.update(id, ProjectUpdate(**data))
    else:
        service_factory.project.create(ProjectCreate(**data))

    return RedirectResponse(url="/admin_v2/projects", status_code=303)


@router.post("/projects/delete/{project_id}")
async def admin_projects_delete(project_id: int, service_factory=Depends(get_service_factory)):
    service_factory.project.delete(project_id)
    return RedirectResponse(url="/admin_v2/projects", status_code=303)


# ==========================================================
# EVENTS (PublicEvent)
# DB: public_events(..., tags character varying[])
# ==========================================================

@router.get("/events", response_class=HTMLResponse)
async def admin_events_list(request: Request, service_factory=Depends(get_service_factory)):
    events = service_factory.public_event.get_all()
    return templates.TemplateResponse(
        "admin_v2/events/list.html",
        {
            "request": request,
            "events": events,
            "active_page": "events",
            "page_title": "Quản lý Events",
        },
    )


@router.get("/events/create", response_class=HTMLResponse)
async def admin_events_create(request: Request, service_factory=Depends(get_service_factory)):
    return templates.TemplateResponse(
        "admin_v2/events/edit.html",
        {
            "request": request,
            "event": None,
            "active_page": "events",
        },
    )


@router.get("/events/edit/{event_id}", response_class=HTMLResponse)
async def admin_events_edit(event_id: int, request: Request, service_factory=Depends(get_service_factory)):
    event = service_factory.public_event.get_by_id(event_id)
    # nếu template cần string tags:
    tags_str = ", ".join(event.tags) if getattr(event, "tags", None) else ""
    return templates.TemplateResponse(
        "admin_v2/events/edit.html",
        {
            "request": request,
            "event": event,
            "tags_str": tags_str,
            "active_page": "events",
        },
    )


@router.post("/events/save")
async def admin_events_save(
    request: Request,
    id: Optional[int] = Form(None),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    summary: Optional[str] = Form(None),
    img_url: Optional[str] = Form(None),
    events_date: Optional[str] = Form(None),  # service/schema có thể parse
    location: Optional[str] = Form(None),
    register_link: Optional[str] = Form(None),
    facebook_url: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),  # comma-separated
    service_factory=Depends(get_service_factory),
):
    data = {
        "title": title,
        "description": description,
        "summary": summary,
        "img_url": img_url,
        "events_date": events_date,
        "location": location,
        "register_link": register_link,
        "facebook_url": facebook_url,
        "tags": _parse_tags(tags),
    }

    if id:
        service_factory.public_event.update(id, PublicEventUpdate(**data))
    else:
        service_factory.public_event.create(PublicEventCreate(**data))

    return RedirectResponse(url="/admin_v2/events", status_code=303)


@router.post("/events/delete/{event_id}")
async def admin_events_delete(event_id: int, service_factory=Depends(get_service_factory)):
    service_factory.public_event.delete(event_id)
    return RedirectResponse(url="/admin_v2/events", status_code=303)


# ==========================================================
# POSTS
# DB: posts(... img_urls character varying[])
# ==========================================================

@router.get("/posts", response_class=HTMLResponse)
async def admin_posts_list(request: Request, service_factory=Depends(get_service_factory)):
    posts = service_factory.post.get_all()
    return templates.TemplateResponse(
        "admin_v2/posts/list.html",
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
        "admin_v2/posts/edit.html",
        {
            "request": request,
            "post": None,
            "img_urls_text": "",
            "active_page": "posts",
        },
    )


@router.get("/posts/edit/{post_id}", response_class=HTMLResponse)
async def admin_posts_edit(post_id: int, request: Request, service_factory=Depends(get_service_factory)):
    post = service_factory.post.get_by_id(post_id)
    img_urls = getattr(post, "img_urls", None) or []
    img_urls_text = "\n".join(img_urls) if isinstance(img_urls, list) else str(img_urls)
    return templates.TemplateResponse(
        "admin_v2/posts/edit.html",
        {
            "request": request,
            "post": post,
            "img_urls_text": img_urls_text,
            "active_page": "posts",
        },
    )


@router.post("/posts/save")
async def admin_posts_save(
    request: Request,
    id: Optional[int] = Form(None),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    summary: Optional[str] = Form(None),
    img_urls_text: Optional[str] = Form(None),  # textarea name="img_urls_text"
    hashtag: Optional[str] = Form(None),
    events_date: Optional[str] = Form(None),
    facebook_url: Optional[str] = Form(None),
    service_factory=Depends(get_service_factory),
):
    data = {
        "title": title,
        "description": description,
        "summary": summary,
        "img_urls": _parse_img_urls(img_urls_text),
        "hashtag": hashtag,
        "events_date": events_date,
        "facebook_url": facebook_url,
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


# ==========================================================
# KEYWORDS (Tags)
# DB: keywords(id, keyword_name, number_blog_contain)
# ==========================================================

@router.get("/keywords", response_class=HTMLResponse)
async def admin_keywords_list(request: Request, service_factory=Depends(get_service_factory)):
    keywords = service_factory.keyword.get_all()
    return templates.TemplateResponse(
        "admin_v2/keywords/list.html",
        {
            "request": request,
            "keywords": keywords,
            "active_page": "keywords",
            "page_title": "Quản lý Từ khóa (Tags)",
        },
    )


@router.get("/keywords/create", response_class=HTMLResponse)
async def admin_keywords_create(request: Request, service_factory=Depends(get_service_factory)):
    return templates.TemplateResponse(
        "admin_v2/keywords/edit.html",
        {
            "request": request,
            "keyword": None,
            "active_page": "keywords",
        },
    )


@router.get("/keywords/edit/{keyword_id}", response_class=HTMLResponse)
async def admin_keywords_edit(keyword_id: int, request: Request, service_factory=Depends(get_service_factory)):
    keyword = service_factory.keyword.get_by_id(keyword_id)
    return templates.TemplateResponse(
        "admin_v2/keywords/edit.html",
        {
            "request": request,
            "keyword": keyword,
            "active_page": "keywords",
        },
    )


@router.post("/keywords/save")
async def admin_keywords_save(
    request: Request,
    id: Optional[int] = Form(None),
    keyword_name: str = Form(...),
    service_factory=Depends(get_service_factory),
):
    data = {"keyword_name": keyword_name}

    if id:
        service_factory.keyword.update(id, KeywordUpdate(**data))
    else:
        service_factory.keyword.create(KeywordCreate(**data))

    return RedirectResponse(url="/admin_v2/keywords", status_code=303)


@router.post("/keywords/delete/{keyword_id}")
async def admin_keywords_delete(keyword_id: int, service_factory=Depends(get_service_factory)):
    service_factory.keyword.delete(keyword_id)
    return RedirectResponse(url="/admin_v2/keywords", status_code=303)