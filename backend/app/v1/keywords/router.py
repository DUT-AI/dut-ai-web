from fastapi import APIRouter, Depends
from app.core.dependencies import get_service_factory
from .schema import KeywordCreate, KeywordUpdate, KeywordResponse


# --- Keywords Router ---
keyword_router = APIRouter(prefix="/keywords", tags=["Keywords"])


@keyword_router.get("/", response_model=list[KeywordResponse])
def get_keywords(service_factory=Depends(get_service_factory)):
    return service_factory.keyword.get_all()


@keyword_router.get("/{id}", response_model=KeywordResponse)
def get_keyword(id: int, service_factory=Depends(get_service_factory)):
    return service_factory.keyword.get_by_id(id)


@keyword_router.post("/", response_model=KeywordResponse)
def create_keyword(
    keyword: KeywordCreate, service_factory=Depends(get_service_factory)
):
    return service_factory.keyword.create(keyword)


@keyword_router.put("/{id}", response_model=KeywordResponse)
def update_keyword(
    id: int,
    keyword: KeywordUpdate,
    service_factory=Depends(get_service_factory),
):
    return service_factory.keyword.update(id, keyword)


@keyword_router.delete("/{id}")
def delete_keyword(id: int, service_factory=Depends(get_service_factory)):
    service_factory.keyword.delete(id)
    return {"status": "ok"}
