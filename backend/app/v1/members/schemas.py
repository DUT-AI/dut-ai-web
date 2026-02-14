from pydantic import BaseModel
from typing import Optional


class MemberResponse(BaseModel):
    id: int
    name: str
    email: str
    phone_number: Optional[str] = None
    status: str
    role_id: int
    role_name: str
    avatar_url: Optional[str] = None
    discord_id: Optional[str] = None
