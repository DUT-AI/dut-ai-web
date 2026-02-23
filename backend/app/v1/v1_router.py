from fastapi import APIRouter
from app.v1.projects.router import router as projects_router
from app.v1.introductions.router import router as introductions_router
from app.v1.members.router import router as members_router
from app.v1.blogs.router import router as blogs_router
from app.v1.events.router import router as events_router

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(projects_router)
v1_router.include_router(introductions_router)
v1_router.include_router(members_router)
v1_router.include_router(blogs_router)
v1_router.include_router(events_router)