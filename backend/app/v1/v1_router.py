from fastapi import APIRouter
from app.v1.projects.router import router as projects_router
from app.v1.introductions.router import router as introductions_router
from app.v1.blogs.router import router as blogs_router
from app.v1.keywords.router import keyword_router as blogs_keyword_router
from app.v1.public_events.router import router as public_events_router
from app.v1.posts.router import router as posts_router
from app.v1.homepage.router import router as homepage_router
from app.v1.users.router import router as users_router
from app.v1.media.router import router as media_router

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(media_router)
v1_router.include_router(projects_router)
v1_router.include_router(introductions_router)
v1_router.include_router(blogs_router)
v1_router.include_router(blogs_keyword_router)
v1_router.include_router(public_events_router)
v1_router.include_router(posts_router)
v1_router.include_router(homepage_router)
v1_router.include_router(users_router)
