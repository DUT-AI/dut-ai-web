from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import User


class UserRepository(BaseRepository[User]):

    def __init__(self, db: Session):
        super().__init__(User, db)
