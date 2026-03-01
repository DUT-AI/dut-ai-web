from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str
    phone_number: Optional[str] = None
    status: str = "active"
    role_id: int
    role_name: str
    avatar_url: Optional[str] = None
    discord_id: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    status: Optional[str] = None
    role_id: Optional[int] = None
    role_name: Optional[str] = None
    avatar_url: Optional[str] = None
    discord_id: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone_number: Optional[str] = None
    status: str
    role_id: int
    role_name: str
    avatar_url: Optional[str] = None
    discord_id: Optional[str] = None


class UserSyncResult(BaseModel):
    message: str
    synced_count: int
