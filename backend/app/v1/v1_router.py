from fastapi import APIRouter
from app.v1.media.router import router as media_router

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(media_router)
