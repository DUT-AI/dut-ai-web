from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    image_url: Optional[str] = None
    event_date: datetime

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class EventResponse(EventBase):
    id: int

    class Config:
        from_attributes = True