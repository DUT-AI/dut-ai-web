from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import PublicEvent


class PublicEventRepository(BaseRepository[PublicEvent]):
    def __init__(self, db: Session):
        super().__init__(PublicEvent, db)
