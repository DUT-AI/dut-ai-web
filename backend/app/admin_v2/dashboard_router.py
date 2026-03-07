from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app.core.auth import is_admin_logged_in, set_admin_session, clear_admin_session
from app.core.config import settings
from app.core.dependencies import get_service_factory


router = APIRouter(prefix="/admin_v2", tags=["Admin V2"])
templates = Jinja2Templates(directory="app/templates")


def _redirect_login():
    return RedirectResponse(url="/admin_v2/login", status_code=303)


def _redirect_dashboard():
    return RedirectResponse(url="/admin_v2", status_code=303)


@router.get("/login", response_class=HTMLResponse)
async def admin_v2_login_page(request: Request):
    if is_admin_logged_in(request):
        return _redirect_dashboard()

    return templates.TemplateResponse(
        "admin_v2/login.html",
        {
            "request": request,
            "error": None,
        },
    )


@router.post("/login", response_class=HTMLResponse)
async def admin_v2_login_submit(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
):
    username = username.strip()
    password = password.strip()

    if (
        username == settings.ADMIN_USERNAME
        and password == settings.ADMIN_PASSWORD
    ):
        set_admin_session(request)
        return RedirectResponse(url="/admin_v2", status_code=303)

    return templates.TemplateResponse(
        "admin_v2/login.html",
        {
            "request": request,
            "error": "Sai tài khoản hoặc mật khẩu",
        },
        status_code=400,
    )


@router.get("/logout")
async def admin_v2_logout(request: Request):
    clear_admin_session(request)
    return RedirectResponse(url="/admin_v2/login", status_code=303)


@router.get("", response_class=HTMLResponse)
@router.get("/", response_class=HTMLResponse, include_in_schema=False)
async def admin_dashboard(
    request: Request,
    service_factory=Depends(get_service_factory),
):
    
    if not is_admin_logged_in(request):
        return _redirect_login()

    stats = service_factory.admin.get_dashboard_stats()
    return templates.TemplateResponse(
        "admin_v2/dashboard.html",
        {
            "request": request,
            "active_page": "dashboard",
            "page_title": "Tổng quan hệ thống",
            "stats": stats,
        },
    )