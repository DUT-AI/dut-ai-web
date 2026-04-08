import re
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Request, Depends, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app.core.dependencies import get_service_factory
from app.v1.public_events.schemas import PublicEventCreate, PublicEventUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])
templates = Jinja2Templates(directory="app/templates")


def _clean_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    value = value.strip()
    return value if value else None


def _normalize_multiline_urls(value: Optional[str]) -> Optional[str]:
    if not value:
        return None

    raw = value.strip()

    if "," in raw and "\n" not in raw:
        parts = [x.strip() for x in raw.split(",") if x.strip()]
    else:
        parts = [x.strip() for x in raw.splitlines() if x.strip()]

    return "\n".join(parts) if parts else None


def _first_image(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    lines = [x.strip() for x in value.splitlines() if x.strip()]
    return lines[0] if lines else None


def _parse_tags(tags_str: Optional[str]) -> List[str]:
    if not tags_str:
        return []
    return [t.strip() for t in tags_str.split(",") if t.strip()]


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


@router.get("/events", response_class=HTMLResponse)
async def admin_events_list(request: Request, service_factory=Depends(get_service_factory)):
    events = service_factory.public_event.get_all()

    for e in events:
        e.thumbnail_url = _first_image(getattr(e, "img_url", None))

    return templates.TemplateResponse(
        "admin/events/list.html",
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
        "admin/events/edit.html",
        {
            "request": request,
            "event": None,
            "active_page": "events",
            "tags_str": "",
        },
    )


@router.get("/events/edit/{event_id}", response_class=HTMLResponse)
async def admin_events_edit(event_id: int, request: Request, service_factory=Depends(get_service_factory)):
    event = service_factory.public_event.get_by_id(event_id)
    tags_str = ", ".join(event.tags) if getattr(event, "tags", None) else ""

    if event:
        event.thumbnail_url = _first_image(getattr(event, "img_url", None))

    return templates.TemplateResponse(
        "admin/events/edit.html",
        {
            "request": request,
            "event": event,
            "active_page": "events",
            "tags_str": tags_str,
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
    events_date: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    register_link: Optional[str] = Form(None),
    facebook_url: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    service_factory=Depends(get_service_factory),
):
    data = {
        "title": title.strip(),
        "description": _clean_text(description),
        "summary": _clean_text(summary),
        "img_url": _normalize_multiline_urls(img_url),
        "events_date": _normalize_datetime_input(events_date),
        "location": _clean_text(location),
        "register_link": _clean_text(register_link),
        "facebook_url": _clean_text(facebook_url),
        "tags": _parse_tags(tags),
    }

    if id:
        service_factory.public_event.update(id, PublicEventUpdate(**data))
    else:
        service_factory.public_event.create(PublicEventCreate(**data))

    return RedirectResponse(url="/admin/events", status_code=303)


@router.post("/events/delete/{event_id}")
async def admin_events_delete(event_id: int, service_factory=Depends(get_service_factory)):
    service_factory.public_event.delete(event_id)
    return RedirectResponse(url="/admin/events", status_code=303)