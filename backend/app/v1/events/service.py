from app.core.base_service import BaseService
from .repository import EventRepository
from .models import Event
from .schemas import EventCreate, EventUpdate

class EventService(
    BaseService[Event, EventCreate, EventUpdate]
):
    def __init__(self, repo: EventRepository):
        super().__init__(repo, entity_name="Event")