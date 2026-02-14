import httpx
from fastapi import HTTPException

from app.core.config import settings
from .schemas import MemberResponse


class MemberService:
    """Proxy service — lấy members từ API manage.dutai.site."""

    API_URL = "https://manage.dutai.site/api/v1/users"

    def get_all(self) -> list[MemberResponse]:
        data = self._fetch_from_api()
        return [MemberResponse(**user) for user in data]

    def get_by_id(self, member_id: int) -> MemberResponse:
        data = self._fetch_from_api()
        for user in data:
            if user.get("id") == member_id:
                return MemberResponse(**user)
        raise HTTPException(status_code=404, detail="Member not found")

    def _fetch_from_api(self) -> list[dict]:
        """Gọi API manage.dutai.site và trả về list user dicts."""
        api_key = settings.DUT_MANAGER_API_KEY
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="DUT_MANAGER_API_KEY chưa được cấu hình trong .env",
            )

        headers = {"Authorization": f"Bearer {api_key}"}

        try:
            response = httpx.get(self.API_URL, headers=headers, timeout=10)
            response.raise_for_status()
        except httpx.HTTPError as e:
            raise HTTPException(
                status_code=502,
                detail=f"Lỗi khi gọi API manage.dutai.site: {str(e)}",
            ) from e

        json_data = response.json()

        # API trả về {"is_success": true, "data": [...]}
        if isinstance(json_data, dict) and "data" in json_data:
            return json_data["data"]

        raise HTTPException(
            status_code=502,
            detail=f"Response không đúng format. Keys: {list(json_data.keys()) if isinstance(json_data, dict) else type(json_data).__name__}",
        )
