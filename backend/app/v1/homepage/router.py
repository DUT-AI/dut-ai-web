from fastapi import APIRouter, Depends, Query
from app.core.dependencies import get_service_factory
from .schemas import HomepageResponse


router = APIRouter(prefix="/homepage", tags=["Homepage"])


@router.get("", response_model=HomepageResponse)
def get_homepage(
    limit: int = Query(default=9, ge=1, le=20, description="Số lượng items mỗi loại"),
    service_factory=Depends(get_service_factory),
):
    """Trả về dữ liệu trang chủ thông qua HomepageService."""
    return service_factory.homepage.get_homepage_data(limit=limit)
