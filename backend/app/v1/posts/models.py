from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.dialects import postgresql
from app.core.database import Base
from app.core.mixins import HasImageUpload
import datetime


class Post(Base, HasImageUpload):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    img_urls = Column(postgresql.ARRAY(String), nullable=True)
    hashtag = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )
