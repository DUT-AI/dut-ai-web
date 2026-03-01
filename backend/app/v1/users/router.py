from fastapi import APIRouter, Depends
from app.v1.users.schemas import UserResponse, UserSyncResult
from app.core.dependencies import get_service_factory
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
def get_users(service_factory=Depends(get_service_factory)):
    return service_factory.user.get_all()


@router.post("/sync", response_model=UserSyncResult)
def sync_users(service_factory=Depends(get_service_factory)):
    return service_factory.user.sync_users()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, service_factory=Depends(get_service_factory)):
    return service_factory.user.get_by_id(user_id)
