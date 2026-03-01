from typing import List, Optional

from app.core.base_repository import BaseRepository
from sqlalchemy.orm import Session

from .models import Keyword


class KeywordRepository(BaseRepository[Keyword]):
    def __init__(self, db: Session):
        super().__init__(Keyword, db)

    def get_by_name(self, name: str) -> Optional[Keyword]:
        return self.db.query(Keyword).filter(Keyword.keyword_name == name).first()

    def get_or_create(self, name: str) -> Keyword:
        keyword = self.get_by_name(name)
        if not keyword:
            keyword = self.create(keyword_name=name)
        return keyword
