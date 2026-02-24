from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from .schemas import BlogResponse
from .repository import BlogRepository
from .service import BlogService

router = APIRouter(prefix="/blogs", tags=["Blogs"])

# Hàm khởi tạo Service (Dependency Injection)
def get_blog_service(db: Session = Depends(get_db)):
    repo = BlogRepository(db)
    return BlogService(repo)

# API Lấy danh sách
@router.get("/", response_model=list[BlogResponse])
def list_blogs(service: BlogService = Depends(get_blog_service)):
    return service.get_all()

# API Lấy chi tiết 1 bài
@router.get("/{id}", response_model=BlogResponse)
def get_blog(id: int, service: BlogService = Depends(get_blog_service)):
    return service.get_by_id(id)