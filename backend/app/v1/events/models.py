from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base
import datetime

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=True)
    event_date = Column(DateTime, default=datetime.datetime.utcnow)
    image_url = Column(String(500), nullable=True)

    def __str__(self):
        return self.title