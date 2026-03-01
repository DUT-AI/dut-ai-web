from fastapi import APIRouter, Depends, UploadFile, File, Query
import uuid
import mimetypes
from app.core.dependencies import get_minio_service
from app.v1.media.service import MinioService

router = APIRouter(prefix="/media", tags=["Media"])


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Query("others", description="Thư mục lưu trữ trên MinIO"),
    minio_service: MinioService = Depends(get_minio_service),
):
    """
    API upload file dùng chung cho toàn hệ thống.
    """
    file_data = await file.read()

    content_type, _ = mimetypes.guess_type(file.filename)
    content_type = content_type or "application/octet-stream"

    # Tạo tên file duy nhất
    unique_filename = f"{folder}/async-{uuid.uuid4().hex}-{file.filename}"

    file_url = minio_service.upload_file(
        file_data=file_data, filename=unique_filename, content_type=content_type
    )

    return {"url": file_url}
