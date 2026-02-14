from sqlalchemy.orm import Session
from app.core.base_repository import BaseRepository
from .models import Introduction


class IntroductionRepository(BaseRepository[Introduction]):

    def __init__(self, db: Session):
        super().__init__(Introduction, db)
