from app.core.base_service import BaseService
from .repository import KeywordRepository
from .models import Keyword
from .schema import (
    KeywordCreate,
    KeywordUpdate,
)  # Wait, let me check the schema file name


class KeywordService(BaseService[Keyword, KeywordCreate, KeywordUpdate]):
    def __init__(self, repo: KeywordRepository):
        super().__init__(repo, entity_name="Keyword")
