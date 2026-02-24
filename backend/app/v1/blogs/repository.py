from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import Blog

class BlogRepository(BaseRepository[Blog]):

    def __init__(self, db: Session):
        super().__init__(Blog, db)