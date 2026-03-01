import httpx
from app.core.config import settings
from app.core.base_service import BaseService
from .models import User
from .repository import UserRepository
from .schemas import UserCreate, UserUpdate, UserResponse
from fastapi import HTTPException


class UserService(BaseService[User, UserCreate, UserUpdate]):
    API_URL = "https://manage.dutai.site/api/v1/users"

    def __init__(self, repo: UserRepository):
        super().__init__(repo, entity_name="User")

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
            user = self.repo.db.query(User).filter(User.id == data["id"]).first()
            if not user:
                user = User(id=data["id"])
                self.repo.db.add(user)

            user.name = data.get("name")
            user.email = data.get("email")
            user.phone_number = data.get("phone_number")
            user.status = data.get("status")
            user.role_id = data.get("role_id")
            user.role_name = data.get("role_name")
            user.avatar_url = data.get("avatar_url")
            user.discord_id = data.get("discord_id")

            synced_count += 1

        self.repo.db.commit()
        return {"message": "Đồng bộ user thành công", "synced_count": synced_count}

    def get_all(self) -> list[User]:
        return self.repo.get_all()

    def get_by_id(self, user_id: int) -> User:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
