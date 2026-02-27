from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from .schemas import BlogResponse
from .repository import BlogRepository
from .service import BlogService
from fastapi import Query
from .schemas import AuthorStatsResponse
from typing import Optional
from fastapi import UploadFile, File
import uuid
import mimetypes
from app.v1.media.service import MinioService

# Cửa ngầm để nhận ảnh từ Admin UI gửi lên

router = APIRouter(prefix="/blogs", tags=["Blogs"])

def get_blog_service(db: Session = Depends(get_db)):
    repo = BlogRepository(db)
    return BlogService(repo)

# @router.get("/", response_model=list[BlogResponse])
# def list_blogs(service: BlogService = Depends(get_blog_service)):
#     return service.get_all()
@router.post("/upload-async")
async def upload_async_image(file: UploadFile = File(...)):
    minio_service = MinioService()
    file_data = await file.read()
    
    content_type, _ = mimetypes.guess_type(file.filename)
    content_type = content_type or "application/octet-stream"
    
    unique_filename = f"blogs/async-{uuid.uuid4().hex}-{file.filename}"
    
    file_url = minio_service.upload_file(
        file_data=file_data, 
        filename=unique_filename,
        content_type=content_type
    )
    return {"url": file_url}

@router.get("/", response_model=list[BlogResponse])
def get_blogs(
    title: Optional[str] = Query(None, description="Tìm theo tiêu đề bài viết"),
    keyword: Optional[str] = Query(None, description="Tìm theo từ khóa (keywords)"),
    service: BlogService = Depends(get_blog_service)
):
    return service.get_all_blogs(title=title, keyword=keyword)

@router.get("/top-viewed", response_model=list[BlogResponse])
def get_top_viewed_blogs(limit: int = Query(5, description="Số lượng bài muốn lấy"), service: BlogService = Depends(get_blog_service)):
    return service.get_top_viewed(limit)

@router.get("/top-authors", response_model=list[AuthorStatsResponse])
def get_top_authors(limit: int = Query(5, description="Số lượng tác giả muốn lấy"), service: BlogService = Depends(get_blog_service)):
    return service.get_top_authors(limit)

@router.get("/{id}", response_model=BlogResponse)
def get_blog(id: int, service: BlogService = Depends(get_blog_service)):
    return service.get_by_id(id)