from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.v1.users.schemas import UserResponse, UserSyncResult
from app.v1.users.service import UserService
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_all()


@router.post("/sync", response_model=UserSyncResult)
def sync_users(db: Session = Depends(get_db)):
    service = UserService(db)
    return service.sync_users()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_by_id(user_id)
