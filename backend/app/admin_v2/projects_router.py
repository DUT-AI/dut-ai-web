import json
from typing import Optional

from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from app.core.dependencies import get_service_factory
from app.core.database import SessionLocal
from app.v1.projects.models import Project, ProjectMember
from app.v1.projects.schemas import ProjectCreate, ProjectUpdate
from app.v1.users.models import User

router = APIRouter(prefix="/admin_v2", tags=["Admin V2"])
templates = Jinja2Templates(directory="app/templates")

AVAILABLE_ROLES = [
    "Project Manager",
    "Designer",
    "Business Analysis",
    "BackEnd Developer",
    "FrontEnd Developer",
    "AI Developer",
]


def normalize_multiline_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    value = value.strip()
    return value if value else None


def normalize_image_urls(value: Optional[str]) -> Optional[str]:
    """
    Chuẩn hóa image_url:
    - chấp nhận textarea nhiều dòng
    - nếu lỡ nhập kiểu phân cách bằng dấu phẩy thì chuyển thành nhiều dòng
    - loại bỏ dòng trống
    """
    if not value:
        return None

    raw = value.strip()

    # Nếu người dùng paste bằng dấu phẩy và không có xuống dòng
    if "," in raw and "\n" not in raw:
        parts = [x.strip() for x in raw.split(",") if x.strip()]
    else:
        parts = [x.strip() for x in raw.splitlines() if x.strip()]

    return "\n".join(parts) if parts else None


def get_first_image(image_url: Optional[str]) -> Optional[str]:
    if not image_url:
        return None
    lines = [x.strip() for x in image_url.splitlines() if x.strip()]
    return lines[0] if lines else None


def group_project_members(project_id: int):
    with SessionLocal() as session:
        rows = (
            session.query(ProjectMember, User)
            .join(User, User.id == ProjectMember.user_id)
            .filter(ProjectMember.project_id == project_id)
            .all()
        )

        grouped = {}
        for pm, user in rows:
            if pm.user_id not in grouped:
                grouped[pm.user_id] = {
                    "user_id": pm.user_id,
                    "user_name": getattr(user, "name", "") or getattr(user, "full_name", "") or user.email,
                    "user_email": user.email,
                    "roles": [],
                }
            grouped[pm.user_id]["roles"].append(pm.role)

        return list(grouped.values())


def sync_project_members(project_id: int, members_data: list):
    with SessionLocal() as session:
        session.query(ProjectMember).filter(ProjectMember.project_id == project_id).delete()

        for member in members_data or []:
            user_id = member.get("user_id")
            roles = member.get("roles", [])

            if not user_id or not roles:
                continue

            for role in roles:
                if role not in AVAILABLE_ROLES:
                    continue
                session.add(
                    ProjectMember(
                        project_id=project_id,
                        user_id=user_id,
                        role=role,
                    )
                )

        session.commit()


@router.get("/projects", response_class=HTMLResponse)
async def admin_projects_list(
    request: Request,
    service_factory=Depends(get_service_factory),
):
    projects = service_factory.project.get_all()

    # Gắn thumbnail đầu tiên để list dễ render
    for p in projects:
        p.thumbnail_url = get_first_image(getattr(p, "image_url", None))

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
async def admin_projects_create(
    request: Request,
    service_factory=Depends(get_service_factory),
):
    users = []
    with SessionLocal() as session:
        db_users = session.query(User).order_by(User.id.desc()).all()
        for u in db_users:
            users.append(
                {
                    "id": u.id,
                    "name": getattr(u, "name", "") or getattr(u, "full_name", "") or u.email,
                    "email": u.email,
                }
            )

    return templates.TemplateResponse(
        "admin_v2/projects/edit.html",
        {
            "request": request,
            "project": None,
            "users": users,
            "project_members_json": "[]",
            "available_roles": AVAILABLE_ROLES,
            "active_page": "projects",
        },
    )


@router.get("/projects/edit/{project_id}", response_class=HTMLResponse)
async def admin_projects_edit(
    project_id: int,
    request: Request,
    service_factory=Depends(get_service_factory),
):
    project = service_factory.project.get_by_id(project_id)

    users = []
    with SessionLocal() as session:
        db_users = session.query(User).order_by(User.id.desc()).all()
        for u in db_users:
            users.append(
                {
                    "id": u.id,
                    "name": getattr(u, "name", "") or getattr(u, "full_name", "") or u.email,
                    "email": u.email,
                }
            )

    project_members = group_project_members(project_id) if project else []

    # Gắn thumbnail đầu tiên để preview
    if project:
        project.thumbnail_url = get_first_image(getattr(project, "image_url", None))

    return templates.TemplateResponse(
        "admin_v2/projects/edit.html",
        {
            "request": request,
            "project": project,
            "users": users,
            "project_members_json": json.dumps(project_members, ensure_ascii=False),
            "available_roles": AVAILABLE_ROLES,
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
    project_members: Optional[str] = Form("[]"),
    service_factory=Depends(get_service_factory),
):
    normalized_data = {
        "title": title.strip(),
        "description": normalize_multiline_text(description),
        "image_url": normalize_image_urls(image_url),
        "features": normalize_multiline_text(features),
        "technologies": normalize_multiline_text(technologies),
        "demo_url": normalize_multiline_text(demo_url),
        "video_url": normalize_multiline_text(video_url),
    }

    try:
        members_data = json.loads(project_members or "[]")
        if not isinstance(members_data, list):
            members_data = []
    except Exception:
        members_data = []

    if id:
        service_factory.project.update(id, ProjectUpdate(**normalized_data))
        sync_project_members(id, members_data)
    else:
        created = service_factory.project.create(ProjectCreate(**normalized_data))

        # lấy id sau khi tạo
        created_id = getattr(created, "id", None)
        if created_id is None:
            # fallback nếu service không trả object
            latest = service_factory.project.get_all()
            if latest:
                created_id = latest[0].id

        if created_id:
            sync_project_members(created_id, members_data)

    return RedirectResponse(url="/admin_v2/projects", status_code=303)


@router.post("/projects/delete/{project_id}")
async def admin_projects_delete(
    project_id: int,
    service_factory=Depends(get_service_factory),
):
    # Xóa members trước
    with SessionLocal() as session:
        session.query(ProjectMember).filter(ProjectMember.project_id == project_id).delete()
        session.commit()

    service_factory.project.delete(project_id)
    return RedirectResponse(url="/admin_v2/projects", status_code=303)