from fastapi import APIRouter

from app.admin.dashboard_router import router as dashboard_router
from app.admin.users_router import router as users_router
from app.admin.blogs_router import router as blogs_router
from app.admin.projects_router import router as projects_router
from app.admin.events_router import router as events_router
from app.admin.posts_router import router as posts_router
from app.admin.keywords_router import router as keywords_router

router = APIRouter()

router.include_router(dashboard_router)
router.include_router(users_router)
router.include_router(blogs_router)
router.include_router(projects_router)
router.include_router(events_router)
router.include_router(posts_router)
router.include_router(keywords_router)