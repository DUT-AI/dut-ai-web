from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.core.auth import AdminAuthMiddleware
from app.core.config import settings
from app.v1.v1_router import v1_router
from app.admin.router import router as admin_router

app = FastAPI(title="DUT-AI FastAPI Backend")

app.add_middleware(
    AdminAuthMiddleware,
    protected_prefix="/admin",
    excluded_paths={
        "/admin/login",
        "/admin/logout",
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

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(v1_router, prefix="/api")
app.include_router(admin_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to DUT-AI FastAPI Backend"}


@app.get("/health")
def health_check():
    return {"status": "ok"}