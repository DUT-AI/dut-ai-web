from pydantic import BaseModel, model_validator
from datetime import datetime
from typing import Optional, Any

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[str] = None
    event_type: Optional[str] = "workshop"
    registration_link: Optional[str] = None
    hashtags: Optional[str] = None

class EventCreate(EventBase):
    image_url: Optional[str] = None

class EventUpdate(EventBase):
    image_url: Optional[str] = None

class EventResponse(EventBase):
    id: int
    image_urls: list[str] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @model_validator(mode="before")
    @classmethod
    def parse_image_urls(cls, data: Any) -> Any:
        # Lấy image_url từ ORM object hoặc dict
        if hasattr(data, "image_url"):
            raw = data.image_url or ""
        elif isinstance(data, dict):
            raw = data.get("image_url", "") or ""
        else:
            raw = ""

        urls = [u.strip() for u in raw.split("\n") if u.strip()]

        if isinstance(data, dict):
            data["image_urls"] = urls
        else:
            # ORM object — convert to dict
            data = {c.name: getattr(data, c.name) for c in data.__table__.columns if c.name != "search_vector"}
            data["image_urls"] = urls

        return data

    class Config:
        from_attributes = True