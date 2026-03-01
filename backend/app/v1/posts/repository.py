from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import Post


class PostRepository(BaseRepository[Post]):
    def __init__(self, db: Session):
        super().__init__(Post, db)
