from math import ceil
from typing import Optional

from fastapi import APIRouter, Request, Depends, Form, Query, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app.core.dependencies import get_service_factory
from app.v1.users.schemas import UserCreate, UserUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])
templates = Jinja2Templates(directory="app/templates")


def _clean_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    value = value.strip()
    return value if value else None


def _get_roles(service_factory):
    if hasattr(service_factory, "role"):
        try:
            return service_factory.role.get_all() or []
        except Exception:
            return []
    return []


def _extract_role_name(role) -> Optional[str]:
    for attr in ["role_name", "name", "slug", "code"]:
        value = getattr(role, attr, None)
        value = _clean_text(str(value)) if value is not None else None
        if value:
            return value
    return None


def _find_role_id_from_role_service(service_factory, role_name: Optional[str]) -> Optional[int]:
    target = (_clean_text(role_name) or "").lower()
    if not target:
        return None

    roles = _get_roles(service_factory)
    for role in roles:
        candidates = [
            getattr(role, "name", None),
            getattr(role, "role_name", None),
            getattr(role, "slug", None),
            getattr(role, "code", None),
        ]
        normalized = [str(x).strip().lower() for x in candidates if x is not None]
        if target in normalized:
            role_id = getattr(role, "id", None)
            return int(role_id) if role_id is not None else None
    return None


def _find_role_name_from_role_service(service_factory, role_id: Optional[int]) -> Optional[str]:
    if not role_id:
        return None

    roles = _get_roles(service_factory)
    for role in roles:
        current_id = getattr(role, "id", None)
        if current_id is not None and int(current_id) == int(role_id):
            return _extract_role_name(role)
    return None


def _find_role_id_from_existing_users(service_factory, role_name: Optional[str]) -> Optional[int]:
    target = (_clean_text(role_name) or "").lower()
    if not target:
        return None

    try:
        users = service_factory.user.get_all() or []
    except Exception:
        users = []

    for user in users:
        user_role_name = _clean_text(getattr(user, "role_name", None))
        if user_role_name and user_role_name.lower() == target and getattr(user, "role_id", None):
            return int(user.role_id)

    return None


def _find_role_name_from_existing_users(service_factory, role_id: Optional[int]) -> Optional[str]:
    if not role_id:
        return None

    try:
        users = service_factory.user.get_all() or []
    except Exception:
        users = []

    for user in users:
        user_role_id = getattr(user, "role_id", None)
        if user_role_id is not None and int(user_role_id) == int(role_id):
            user_role_name = _clean_text(getattr(user, "role_name", None))
            if user_role_name:
                return user_role_name

    return None


def _resolve_role_id(
    service_factory,
    role_id: Optional[int],
    role_name: Optional[str],
    current_user=None,
) -> int:
    if role_id:
        return int(role_id)

    found = _find_role_id_from_role_service(service_factory, role_name)
    if found:
        return found

    found = _find_role_id_from_existing_users(service_factory, role_name)
    if found:
        return found

    if current_user is not None and getattr(current_user, "role_id", None):
        return int(current_user.role_id)

    raise HTTPException(
        status_code=400,
        detail="Không tìm được role_id hợp lệ. Hãy kiểm tra dữ liệu role hiện có trong DB.",
    )


def _resolve_role_name(
    service_factory,
    role_id: Optional[int],
    role_name: Optional[str],
    current_user=None,
) -> str:
    cleaned_role_name = _clean_text(role_name)
    if cleaned_role_name:
        return cleaned_role_name

    found = _find_role_name_from_role_service(service_factory, role_id)
    if found:
        return found

    found = _find_role_name_from_existing_users(service_factory, role_id)
    if found:
        return found

    if current_user is not None:
        current_role_name = _clean_text(getattr(current_user, "role_name", None))
        if current_role_name:
            return current_role_name

    raise HTTPException(
        status_code=400,
        detail="Không tìm được role_name hợp lệ.",
    )


@router.get("/users", response_class=HTMLResponse)
async def admin_users_list(
    request: Request,
    page: int = Query(1, ge=1),
    service_factory=Depends(get_service_factory),
):
    all_users = service_factory.user.get_all() or []
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
        "admin/users/list.html",
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
async def admin_users_create(request: Request):
    return templates.TemplateResponse(
        "admin/users/edit.html",
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
        "admin/users/edit.html",
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
    role_id: Optional[int] = Form(None),
    role_name: Optional[str] = Form(None),
    status: Optional[str] = Form("active"),
    service_factory=Depends(get_service_factory),
):
    name = _clean_text(name)
    email = _clean_text(email)
    password = _clean_text(password)
    role_name = _clean_text(role_name)
    status = _clean_text(status) or "active"

    if not name:
        raise HTTPException(status_code=400, detail="Tên người dùng không được để trống.")

    if not email:
        raise HTTPException(status_code=400, detail="Email không được để trống.")

    current_user = service_factory.user.get_by_id(id) if id else None

    resolved_role_id = _resolve_role_id(service_factory, role_id, role_name, current_user)
    resolved_role_name = _resolve_role_name(service_factory, resolved_role_id, role_name, current_user)

    data = {
        "name": name,
        "email": email,
        "role_id": resolved_role_id,
        "role_name": resolved_role_name,
        "status": status,
    }

    if id:
        if password:
            data["password"] = password
        try:
            service_factory.user.update(id, UserUpdate(**data))
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        if not password:
            raise HTTPException(status_code=400, detail="Mật khẩu không được để trống khi tạo mới người dùng.")
        data["password"] = password
        try:
            service_factory.user.create(UserCreate(**data))
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    return RedirectResponse(url="/admin/users", status_code=303)


@router.post("/users/delete/{user_id}")
async def admin_users_delete(
    user_id: int,
    service_factory=Depends(get_service_factory),
):
    service_factory.user.delete(user_id)
    return RedirectResponse(url="/admin/users", status_code=303)


@router.post("/users/sync")
async def admin_users_sync(
    service_factory=Depends(get_service_factory),
):
    service_factory.user.sync_users()
    return RedirectResponse(url="/admin/users", status_code=303)