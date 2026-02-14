from fastapi import APIRouter, Depends
from .schemas import MemberResponse
from app.core.dependencies import get_service_factory

router = APIRouter(prefix="/members", tags=["Members"])


@router.get("", response_model=list[MemberResponse])
def list_members(service_factory=Depends(get_service_factory)):
    return service_factory.member.get_all()


@router.get("/{member_id}", response_model=MemberResponse)
def get_member(member_id: int, service_factory=Depends(get_service_factory)):
    return service_factory.member.get_by_id(member_id)
