from sqlalchemy import Column, Integer, String
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, nullable=True)
    status = Column(String)
    role_id = Column(Integer)
    role_name = Column(String)
    avatar_url = Column(String, nullable=True)
    discord_id = Column(String, nullable=True)

    def __str__(self):
        return self.name
