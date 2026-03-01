from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List


class PostBase(BaseModel):
    title: str
    description: Optional[str] = None
    summary: Optional[str] = None
    img_urls: Optional[List[str]] = None
    hashtag: Optional[str] = None
    events_date: Optional[datetime] = None
    facebook_url: Optional[str] = None


class PostCreate(PostBase):
    pass


class PostUpdate(PostBase):
    pass


class PostResponse(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
