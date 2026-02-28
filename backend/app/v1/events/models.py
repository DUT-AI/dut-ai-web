from sqlalchemy import Column, Integer, String, DateTime, Text
from app.core.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    
    event_type = Column(String, nullable=False) 

    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    img_url = Column(String, nullable=True)

    events_date = Column(DateTime, nullable=True)
    location = Column(String, nullable=True)
    register_link = Column(String, nullable=True)

    hashtag = Column(String, nullable=True)
    __mapper_args__ = {
        "polymorphic_on": event_type,
        "polymorphic_identity": "base_event",
    }

class Workshop(Event):
    __mapper_args__ = {
        "polymorphic_identity": "workshop", 
    }

class MemorableEvent(Event):
    __mapper_args__ = {
        "polymorphic_identity": "memorable",
    }