from datetime import datetime
from wtforms import FileField
from starlette.requests import Request

from app.core.admin import BaseAdmin
from app.v1.media.service import MinioService
from .models import Project


class ProjectAdmin(BaseAdmin, model=Project):
    column_list = [Project.id, Project.title, Project.description, Project.image_url,Project.project_url]
    form_excluded_columns = [Project.id, Project.image_url,Project.project_url]

    async def scaffold_form(self, form_rules=None):
        """Override để thêm FileField upload ảnh vào form."""
        form_class = await super().scaffold_form(form_rules)
        form_class.image = FileField("Upload ảnh")
        return form_class

    async def on_model_change(
        self, data: dict, model: Project, is_created: bool, request: Request
    ) -> None:
        """Xử lý upload ảnh lên MinIO khi tạo/sửa project."""
        image = data.pop("image", None)

        if image and hasattr(image, "read"):
            file_data = await image.read()
            if isinstance(file_data, memoryview):
                file_data = bytes(file_data)

            if file_data and len(file_data) > 0:
                minio_service = MinioService()

                error = minio_service.validate_image(image.filename, len(file_data))
                if error:
                    raise ValueError(error)

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                object_name = f"projects/{timestamp}_{image.filename}"
                image_url = minio_service.upload_file(
                    file_data=file_data,
                    filename=object_name,
                    content_type=getattr(image, "content_type", "image/png")
                    or "image/png",
                )
                model.image_url = image_url
