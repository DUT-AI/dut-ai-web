from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from .schemas import EventResponse
from .repository import EventRepository
from .service import EventService

router = APIRouter(prefix="/events", tags=["Events"])

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