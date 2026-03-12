from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin
from starlette.middleware.sessions import SessionMiddleware

from app.core.auth import AdminAuth
from app.core.auth import AdminAuthMiddleware
from app.core.config import settings
from app.core.database import engine
from app.v1.v1_admin import register_admin_views
from app.v1.v1_router import v1_router
from app.admin_v2.dashboard_router import router as admin_dashboard_router
from app.admin_v2.blogs_router import router as admin_blogs_router
from app.admin_v2.projects_router import router as admin_projects_router
from app.admin_v2.events_router import router as admin_events_router
from app.admin_v2.posts_router import router as admin_posts_router
from app.admin_v2.keywords_router import router as admin_keywords_router
from app.admin_v2.users_router import router as users_router

app = FastAPI(title="DUT-AI FastAPI Backend")


app.add_middleware(
    AdminAuthMiddleware,
    protected_prefix="/admin_v2",
    excluded_paths={
        "/admin_v2/login",
        "/admin_v2/logout",
    },
)


app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    max_age=60 * 60 * 8,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

authentication_backend = AdminAuth(secret_key=settings.SECRET_KEY)
admin = Admin(
    app,
    engine,
    templates_dir="app/templates",
    authentication_backend=authentication_backend,
)
register_admin_views(admin)

app.include_router(v1_router, prefix="/api")
app.include_router(admin_dashboard_router)
app.include_router(admin_blogs_router)
app.include_router(admin_projects_router)
app.include_router(admin_events_router)
app.include_router(admin_posts_router)
app.include_router(admin_keywords_router)
app.include_router(users_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to DUT-AI FastAPI Backend"}

@app.get("/health")
def health_check():
    return {"status": "ok"}