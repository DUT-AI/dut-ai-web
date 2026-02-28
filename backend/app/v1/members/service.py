from sqlalchemy.orm import Session
from fastapi import HTTPException
from .models import Member

class MemberService:
    """Service nội bộ — lấy members trực tiếp từ Database PostgreSQL của dự án."""

    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        # Lấy toàn bộ thành viên từ bảng users
        return self.db.query(Member).all()

    def get_by_id(self, member_id: int):
        # Tìm 1 thành viên theo ID
        member = self.db.query(Member).filter(Member.id == member_id).first()
        if not member:
            raise HTTPException(status_code=404, detail="Không tìm thấy Thành viên này trong hệ thống!")
        return member