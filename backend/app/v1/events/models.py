from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base
from app.core.mixins import HasImageUpload
import datetime


class Event(Base, HasImageUpload):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)

    event_type = Column(String, default="workshop")

    event_date = Column(String, nullable=True)
    location = Column(String, nullable=True)
    registration_link = Column(String, nullable=True)

    hashtags = Column(String, nullable=True)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )
