from fastapi import APIRouter, Depends
from app.core.dependencies import get_service_factory
from .schemas import PostResponse, PostCreate, PostUpdate

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.get("", response_model=list[PostResponse])
def get_posts(service_factory=Depends(get_service_factory)):
    return service_factory.post.get_all()


@router.get("/{id}", response_model=PostResponse)
def get_post(id: int, service_factory=Depends(get_service_factory)):
    return service_factory.post.get_by_id(id)


@router.post("", response_model=PostResponse)
def create_post(post: PostCreate, service_factory=Depends(get_service_factory)):
    return service_factory.post.create(post)


@router.put("/{id}", response_model=PostResponse)
def update_post(
    id: int,
    post: PostUpdate,
    service_factory=Depends(get_service_factory),
):
    return service_factory.post.update(id, post)


@router.delete("/{id}")
def delete_post(id: int, service_factory=Depends(get_service_factory)):
    service_factory.post.delete(id)
    return {"status": "ok"}
