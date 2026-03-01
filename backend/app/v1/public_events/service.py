from app.core.base_service import BaseService
from .models import PublicEvent
from .schemas import PublicEventCreate, PublicEventUpdate


class PublicEventService(
    BaseService[PublicEvent, PublicEventCreate, PublicEventUpdate]
):
    def __init__(self, repo):
        super().__init__(repo, entity_name="PublicEvent")
        self.repo = repo
