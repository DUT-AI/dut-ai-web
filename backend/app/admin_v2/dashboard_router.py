from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.core.dependencies import get_service_factory

router = APIRouter(prefix="/admin_v2", tags=["Admin V2"])
templates = Jinja2Templates(directory="app/templates")


@router.get("", response_class=HTMLResponse)
async def admin_dashboard(request: Request, service_factory=Depends(get_service_factory)):
    stats = service_factory.admin.get_dashboard_stats()
    return templates.TemplateResponse(
        "admin_v2/dashboard.html",
        {"request": request, "active_page": "dashboard", "stats": stats},
    )