from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from .schemas import EventResponse
from .repository import EventRepository
from .service import EventService

from fastapi import UploadFile, File
import uuid
import mimetypes
from app.v1.media.service import MinioService


router = APIRouter(prefix="/events", tags=["Events"])

@router.post("/upload-async")
async def upload_async_image(file: UploadFile = File(...)):
    minio_service = MinioService()
    file_data = await file.read()
    
    content_type, _ = mimetypes.guess_type(file.filename)
    content_type = content_type or "application/octet-stream"
    
    # Đặt tên thư mục là events
    unique_filename = f"events/async-{uuid.uuid4().hex}-{file.filename}"
    
    file_url = minio_service.upload_file(
        file_data=file_data, 
        filename=unique_filename,
        content_type=content_type
    )
    return {"url": file_url}

# Hàm khởi tạo Service
def get_event_service(db: Session = Depends(get_db)):
    repo = EventRepository(db)
    return EventService(repo)

# API Lấy danh sách
@router.get("/", response_model=list[EventResponse])
def list_events(service: EventService = Depends(get_event_service)):
    return service.get_all()

# API Lấy chi tiết 1 sự kiện
@router.get("/{id}", response_model=EventResponse)
def get_event(id: int, service: EventService = Depends(get_event_service)):
    return service.get_by_id(id)