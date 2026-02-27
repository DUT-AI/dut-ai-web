from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base
import datetime

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False) 
    authors = Column(String(255), nullable=True) 
    views = Column(Integer, default=0)
    keywords = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    image_url = Column(String(1000), nullable=True)

    def __str__(self):
        return self.title