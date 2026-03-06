from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from typing import Optional

from app.core.dependencies import get_service_factory
from app.v1.keywords.schema import KeywordCreate, KeywordUpdate

router = APIRouter(prefix="/admin_v2", tags=["Admin V2"])
templates = Jinja2Templates(directory="app/templates")


@router.get("/keywords", response_class=HTMLResponse)
async def admin_keywords_list(request: Request, service_factory=Depends(get_service_factory)):
    keywords = service_factory.keyword.get_all()
    return templates.TemplateResponse(
        "admin_v2/keywords/list.html",
        {"request": request, "keywords": keywords, "active_page": "keywords", "page_title": "Quản lý Từ khóa"},
    )


@router.get("/keywords/create", response_class=HTMLResponse)
async def admin_keywords_create(request: Request, service_factory=Depends(get_service_factory)):
    return templates.TemplateResponse(
        "admin_v2/keywords/edit.html",
        {"request": request, "keyword": None, "active_page": "keywords"},
    )


@router.get("/keywords/edit/{keyword_id}", response_class=HTMLResponse)
async def admin_keywords_edit(keyword_id: int, request: Request, service_factory=Depends(get_service_factory)):
    keyword = service_factory.keyword.get_by_id(keyword_id)
    return templates.TemplateResponse(
        "admin_v2/keywords/edit.html",
        {"request": request, "keyword": keyword, "active_page": "keywords"},
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