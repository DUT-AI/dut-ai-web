from math import ceil
from typing import Optional

from fastapi import APIRouter, Request, Depends, Form, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app.core.dependencies import get_service_factory
from app.v1.users.schemas import UserCreate, UserUpdate

router = APIRouter(prefix="/admin_v2", tags=["Admin V2"])
templates = Jinja2Templates(directory="app/templates")


def _clean_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    value = value.strip()
    return value if value else None


@router.get("/users", response_class=HTMLResponse)
async def admin_users_list(
    request: Request,
    page: int = Query(1, ge=1),
    service_factory=Depends(get_service_factory),
):
    all_users = service_factory.user.get_all() or []

    # Sắp xếp theo id tăng dần
    all_users = sorted(all_users, key=lambda u: getattr(u, "id", 0))

    per_page = 10
    total = len(all_users)
    total_pages = max(1, ceil(total / per_page))

    if page > total_pages:
        page = total_pages

    start = (page - 1) * per_page
    end = start + per_page
    users = all_users[start:end]

    return templates.TemplateResponse(
        "admin_v2/users/list.html",
        {
            "request": request,
            "users": users,
            "active_page": "users",
            "page_title": "Quản lý người dùng",
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages,
            "start_index": start + 1 if total > 0 else 0,
            "end_index": min(end, total),
        },
    )


@router.get("/users/create", response_class=HTMLResponse)
async def admin_users_create(
    request: Request,
    service_factory=Depends(get_service_factory),
):
    return templates.TemplateResponse(
        "admin_v2/users/edit.html",
        {
            "request": request,
            "user": None,
            "active_page": "users",
            "page_title": "Tạo người dùng mới",
        },
    )


@router.get("/users/edit/{user_id}", response_class=HTMLResponse)
async def admin_users_edit(
    user_id: int,
    request: Request,
    service_factory=Depends(get_service_factory),
):
    user = service_factory.user.get_by_id(user_id)
    return templates.TemplateResponse(
        "admin_v2/users/edit.html",
        {
            "request": request,
            "user": user,
            "active_page": "users",
            "page_title": "Chỉnh sửa người dùng",
        },
    )


@router.post("/users/save")
async def admin_users_save(
    request: Request,
    id: Optional[int] = Form(None),
    name: str = Form(...),
    email: str = Form(...),
    password: Optional[str] = Form(None),
    role_name: Optional[str] = Form("teammate"),
    status: Optional[str] = Form("active"),
    service_factory=Depends(get_service_factory),
):
    name = name.strip()
    email = email.strip()

    if id:
        data = {
            "name": name,
            "email": email,
            "role_name": _clean_text(role_name) or "teammate",
            "status": _clean_text(status) or "active",
        }

        cleaned_password = _clean_text(password)
        if cleaned_password:
            data["password"] = cleaned_password

        service_factory.user.update(id, UserUpdate(**data))
    else:
        data = {
            "name": name,
            "email": email,
            "password": _clean_text(password) or "123456",
            "role_name": _clean_text(role_name) or "teammate",
            "status": _clean_text(status) or "active",
        }
        service_factory.user.create(UserCreate(**data))

    return RedirectResponse(url="/admin_v2/users", status_code=303)


@router.post("/users/delete/{user_id}")
async def admin_users_delete(
    user_id: int,
    service_factory=Depends(get_service_factory),
):
    service_factory.user.delete(user_id)
    return RedirectResponse(url="/admin_v2/users", status_code=303)