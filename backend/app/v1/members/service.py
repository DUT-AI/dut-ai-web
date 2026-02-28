from sqlalchemy.orm import Session
from fastapi import HTTPException
from .models import Member

class MemberService:
    """Service nội bộ — lấy members trực tiếp từ Database PostgreSQL của dự án."""

    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[MemberResponse]:
        users = self.db.query(User).all()
        return [self._map_user_to_member(user) for user in users]

    def get_by_id(self, member_id: int) -> MemberResponse:
        user = self.db.query(User).filter(User.id == member_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Member not found")
        return self._map_user_to_member(user)

    def _map_user_to_member(self, user: User) -> MemberResponse:
        return MemberResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            phone_number=user.phone_number,
            status=user.status,
            role_id=user.role_id,
            role_name=user.role_name,
            avatar_url=user.avatar_url,
            discord_id=user.discord_id,
        )
