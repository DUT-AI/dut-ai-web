from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.dialects import postgresql
from app.core.database import Base
from app.core.mixins import HasImageUpload
import datetime


class PublicEvent(Base, HasImageUpload):
    __tablename__ = "public_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    img_url = Column(String, nullable=True)
    events_date = Column(DateTime, nullable=True)
    location = Column(String, nullable=True)
    register_link = Column(String, nullable=True)
    facebook_url = Column(String, nullable=True)
    tags = Column(postgresql.ARRAY(String), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )
