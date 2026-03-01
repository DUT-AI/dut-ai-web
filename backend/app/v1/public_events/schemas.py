from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List


class PublicEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    summary: Optional[str] = None
    img_url: Optional[str] = None
    events_date: Optional[datetime] = None
    location: Optional[str] = None
    register_link: Optional[str] = None
    facebook_url: Optional[str] = None
    tags: Optional[List[str]] = None


class PublicEventCreate(PublicEventBase):
    pass


class PublicEventUpdate(PublicEventBase):
    pass


class PublicEventResponse(PublicEventBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
