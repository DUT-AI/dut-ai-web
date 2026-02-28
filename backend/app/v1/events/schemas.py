from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):

    event_type: str
    title: str
    description: Optional[str] = None
    img_url: Optional[str] = None
 
    events_date: Optional[datetime] = None
    location: Optional[str] = None
    register_link: Optional[str] = None

    hashtag: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class EventResponse(EventBase):
    id: int

    class Config:
        from_attributes = True