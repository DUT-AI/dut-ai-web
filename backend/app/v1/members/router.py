from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db

from .schemas import MemberResponse
from .service import MemberService

router = APIRouter(prefix="/members", tags=["Members"])

# Hàm khởi tạo Service, tự động lấy kết nối Database
def get_member_service(db: Session = Depends(get_db)):
    return MemberService(db)

@router.get("", response_model=list[MemberResponse])
def list_members(service: MemberService = Depends(get_member_service)):
    return service.get_all()

@router.get("/{member_id}", response_model=MemberResponse)
def get_member(member_id: int, service: MemberService = Depends(get_member_service)):
    return service.get_by_id(member_id)