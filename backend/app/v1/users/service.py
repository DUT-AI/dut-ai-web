import httpx
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.v1.users.models import User
from app.v1.users.schemas import UserResponse


class UserService:
    API_URL = "https://manage.dutai.site/api/v1/users"

    def __init__(self, db: Session):
        self.db = db

    def sync_users(self):
        api_key = settings.DUT_MANAGER_API_KEY
        if not api_key:
            raise HTTPException(
                status_code=500, detail="DUT_MANAGER_API_KEY chưa được cấu hình"
            )

        headers = {"Authorization": f"Bearer {api_key}"}
        try:
            response = httpx.get(self.API_URL, headers=headers, timeout=10)
            response.raise_for_status()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Lỗi khi gọi API: {str(e)}")

        json_data = response.json()
        if not isinstance(json_data, dict) or "data" not in json_data:
            raise HTTPException(status_code=502, detail="Response không đúng format.")

        users_data = json_data["data"]

        synced_count = 0
        for data in users_data:
            user = self.db.query(User).filter(User.id == data["id"]).first()
            if not user:
                user = User(id=data["id"])
                self.db.add(user)

            user.name = data.get("name")
            user.email = data.get("email")
            user.phone_number = data.get("phone_number")
            user.status = data.get("status")
            user.role_id = data.get("role_id")
            user.role_name = data.get("role_name")
            user.avatar_url = data.get("avatar_url")
            user.discord_id = data.get("discord_id")

            synced_count += 1

        self.db.commit()
        return {"message": "Đồng bộ user thành công", "synced_count": synced_count}

    def get_all(self) -> list[UserResponse]:
        users = self.db.query(User).all()
        return [
            UserResponse.model_validate(user, from_attributes=True) for user in users
        ]

    def get_by_id(self, user_id: int) -> UserResponse:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserResponse.model_validate(user, from_attributes=True)
