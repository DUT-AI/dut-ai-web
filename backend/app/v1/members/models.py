from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base # Đảm bảo đường dẫn Base này đúng với project của bạn
from datetime import datetime, timezone

class Member(Base):
    __tablename__ = "users" # Đặt tên bảng là users theo đúng ý bạn

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    role_name = Column(String, default="teammate")
    
    created_at = Column(DateTime, default=datetime.utcnow)