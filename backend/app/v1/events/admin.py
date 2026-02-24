import uuid
import mimetypes
# Đổi FileField thành MultipleFileField
from wtforms import MultipleFileField 
from app.core.admin import BaseAdmin
from .models import Event

# Nhớ giữ nguyên đường dẫn import MinioService của bạn nhé
from app.v1.media.service import MinioService 

class EventAdmin(BaseAdmin, model=Event):
    name = "Sự kiện"
    name_plural = "Events"
    icon = "fa-solid fa-calendar-days"
    
    column_list = [Event.id, Event.title, Event.location, Event.event_date]
    form_columns = [Event.title, Event.description, Event.location, Event.event_date, Event.image_url]
    column_searchable_list = [Event.title, Event.location]

    # 1. Dùng MultipleFileField để cho phép chọn nhiều ảnh
    form_overrides = {
        "image_url": MultipleFileField
    }

    async def on_model_change(self, data: dict, model: any, is_created: bool, request):
        file_objs = data.get("image_url")
        
        # Kiểm tra xem file_objs có phải là 1 danh sách các file không
        if file_objs and isinstance(file_objs, list):
            minio_service = MinioService()
            uploaded_urls = [] # Tạo 1 cái giỏ để đựng các link ảnh
            
            # 2. Vòng lặp: Xử lý từng ảnh một
            for file_obj in file_objs:
                if hasattr(file_obj, "filename") and file_obj.filename:
                    file_data = file_obj.file.read()
                    
                    content_type, _ = mimetypes.guess_type(file_obj.filename)
                    content_type = content_type or "application/octet-stream"
                    
                    unique_filename = f"events/{uuid.uuid4().hex}-{file_obj.filename}"
                    
                    # Up lên MinIO và lấy link
                    file_url = minio_service.upload_file(
                        file_data=file_data, 
                        filename=unique_filename,
                        content_type=content_type
                    )
                    # Bỏ link vào giỏ
                    uploaded_urls.append(file_url)
            
            # 3. Nếu có ảnh được up lên, ghép các link lại bằng dấu phẩy
            if uploaded_urls:
                data["image_url"] = ",".join(uploaded_urls)
            else:
                # Không up gì thì giữ nguyên dữ liệu cũ
                data.pop("image_url", None)
        else:
            data.pop("image_url", None)
            
        await super().on_model_change(data, model, is_created, request)