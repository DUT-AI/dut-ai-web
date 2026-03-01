from fastapi import APIRouter, Depends
from app.core.dependencies import get_service_factory
from .schemas import PublicEventResponse, PublicEventCreate, PublicEventUpdate

router = APIRouter(prefix="/public-events", tags=["Public Events"])


@router.get("", response_model=list[PublicEventResponse])
def get_public_events(service_factory=Depends(get_service_factory)):
    return service_factory.public_event.get_all()


@router.get("/{id}", response_model=PublicEventResponse)
def get_public_event(id: int, service_factory=Depends(get_service_factory)):
    return service_factory.public_event.get_by_id(id)


@router.post("", response_model=PublicEventResponse)
def create_public_event(
    event: PublicEventCreate, service_factory=Depends(get_service_factory)
):
    return service_factory.public_event.create(event)


@router.put("/{id}", response_model=PublicEventResponse)
def update_public_event(
    id: int,
    event: PublicEventUpdate,
    service_factory=Depends(get_service_factory),
):
    return service_factory.public_event.update(id, event)


@router.delete("/{id}")
def delete_public_event(id: int, service_factory=Depends(get_service_factory)):
    service_factory.public_event.delete(id)
    return {"status": "ok"}
