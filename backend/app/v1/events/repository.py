from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import Event

class EventRepository(BaseRepository[Event]):

    def __init__(self, db: Session):
        super().__init__(Event, db)