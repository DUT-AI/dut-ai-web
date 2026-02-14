from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form

from app.core.dependencies import get_service_factory
from .schemas import ProjectResponse, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectResponse])
def list_projects(service_factory=Depends(get_service_factory)):
    return service_factory.project.get_all()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, service_factory=Depends(get_service_factory)):
    return service_factory.project.get_by_id(project_id)


@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    product_link: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    service_factory=Depends(get_service_factory),
):
    """Tạo project mới, có thể kèm ảnh (multipart form)."""
    return await service_factory.project.create_with_image(
        title=title,
        description=description,
        product_link=product_link,
        image=image,
    )


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int, data: ProjectUpdate, service_factory=Depends(get_service_factory)
):
    return service_factory.project.update(project_id, data)


@router.put("/{project_id}/image", response_model=ProjectResponse)
async def update_project_image(
    project_id: int,
    image: UploadFile = File(...),
    service_factory=Depends(get_service_factory),
):
    """Upload/thay đổi ảnh cho project đã có."""
    return await service_factory.project.update_image(project_id, image)


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, service_factory=Depends(get_service_factory)):
    service_factory.project.delete(project_id)
