from fastapi import APIRouter, Depends
from .schemas import IntroductionResponse, IntroductionCreate, IntroductionUpdate
from app.core.dependencies import get_service_factory

router = APIRouter(prefix="/introductions", tags=["Introductions"])


@router.get("", response_model=list[IntroductionResponse])
def list_introductions(service_factory=Depends(get_service_factory)):
    return service_factory.introduction.get_all()


@router.get("/{intro_id}", response_model=IntroductionResponse)
def get_introduction(intro_id: int, service_factory=Depends(get_service_factory)):
    return service_factory.introduction.get_by_id(intro_id)


@router.post("", response_model=IntroductionResponse, status_code=201)
def create_introduction(
    data: IntroductionCreate, service_factory=Depends(get_service_factory)
):
    return service_factory.introduction.create(data)


@router.put("/{intro_id}", response_model=IntroductionResponse)
def update_introduction(
    intro_id: int,
    data: IntroductionUpdate,
    service_factory=Depends(get_service_factory),
):
    return service_factory.introduction.update(intro_id, data)


@router.delete("/{intro_id}", status_code=204)
def delete_introduction(intro_id: int, service_factory=Depends(get_service_factory)):
    service_factory.introduction.delete(intro_id)
