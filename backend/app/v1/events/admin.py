from app.core.admin import BaseAdmin
from .models import Event, Workshop, MemorableEvent
from wtforms import MultipleFileField, widgets, TextAreaField
from markupsafe import Markup

# --- NÚT UPLOAD ẢNH (Đã sửa id thành img_url cho khớp model) ---
class AutoUploadWidget(widgets.FileInput):
    def __call__(self, field, **kwargs):
        kwargs.setdefault('id', field.id)
        kwargs.setdefault('multiple', True)
        html = super().__call__(field, **kwargs)
        
        script = f"""
        <script>
            setTimeout(() => {{
                const fileInput = document.getElementById('{field.id}');
                const urlInput = document.getElementById('img_url'); // Đã sửa thành img_url
                
                if(fileInput && urlInput) {{
                    if (urlInput.value.includes(',') && !urlInput.value.includes('\\n')) {{
                        urlInput.value = urlInput.value.split(',').map(s => s.trim()).join('\\n');
                    }}

                    fileInput.addEventListener('change', async function(e) {{
                        const files = e.target.files;
                        if (files.length === 0) return;
                        
                        let currentUrls = urlInput.value ? urlInput.value.split('\\n').filter(x => x.trim() !== '') : [];
                        
                        for (let i = 0; i < files.length; i++) {{
                            const formData = new FormData();
                            formData.append('file', files[i]);
                            
                            const originalValue = urlInput.value;
                            urlInput.value = (originalValue ? originalValue + "\\n" : "") + "⏳ Đang tải ảnh " + files[i].name + "...";
                            
                            try {{
                                const response = await fetch('/api/v1/events/upload-async', {{
                                    method: 'POST',
                                    body: formData
                                }});
                                
                                if(response.ok) {{
                                    const data = await response.json();
                                    currentUrls.push(data.url);
                                    urlInput.value = currentUrls.join('\\n');
                                }} else {{
                                    alert("Lỗi tải ảnh!");
                                    urlInput.value = originalValue;
                                }}
                            }} catch (err) {{
                                alert("Lỗi kết nối!");
                                urlInput.value = originalValue;
                            }}
                        }}
                        fileInput.value = ''; 
                    }});
                }}
            }}, 500);
        </script>
        """
        return html + Markup(script)


# ==========================================
# 2. GIAO DIỆN QUẢN LÝ WORKSHOP & SEMINAR
# ==========================================
class WorkshopAdmin(BaseAdmin, model=Workshop):
    name = "Workshop & Seminar"
    name_plural = "Workshops"
    icon = "fa-solid fa-chalkboard-user"
    category = "Sự kiện" 

    # Đã gỡ bỏ created_at vì trong model không có
    column_list = [Workshop.id, Workshop.title, Workshop.events_date, Workshop.location]

    # Đã sửa image_url -> img_url
    form_columns = [
        Workshop.title, 
        Workshop.description, 
        Workshop.events_date, 
        Workshop.location, 
        Workshop.register_link,
        Workshop.img_url
    ]
    
    column_searchable_list = [Workshop.title, Workshop.location]
    form_overrides = {"img_url": TextAreaField}
    form_args = {
        "img_url": {
            "render_kw": {"rows": 6, "class": "form-control", "placeholder": "link ảnh"}
        }
    }

    async def scaffold_form(self, *args, **kwargs):
        form_class = await super().scaffold_form(*args, **kwargs)
        form_class.upload_new_images = MultipleFileField("Tải ảnh từ thiết bị", widget=AutoUploadWidget())
        return form_class

    async def on_model_change(self, data: dict, model: any, is_created: bool, request):
        data.pop("upload_new_images", None)
        await super().on_model_change(data, model, is_created, request)


# ==========================================
# 3. GIAO DIỆN QUẢN LÝ SỰ KIỆN ĐÁNG NHỚ
# ==========================================
class MemorableEventAdmin(BaseAdmin, model=MemorableEvent):
    name = "Sự kiện đáng nhớ"
    name_plural = "Sự kiện đáng nhớ"
    icon = "fa-solid fa-camera-retro"
    category = "Sự kiện" 

    # Đã gỡ bỏ created_at
    column_list = [MemorableEvent.id, MemorableEvent.title, MemorableEvent.hashtag]

    # Đã sửa image_url -> img_url
    form_columns = [
        MemorableEvent.title, 
        MemorableEvent.description, 
        MemorableEvent.hashtag,
        MemorableEvent.img_url
    ]
    
    column_searchable_list = [MemorableEvent.title, MemorableEvent.hashtag]
    form_overrides = {"img_url": TextAreaField}
    form_args = {
        "img_url": {
            "render_kw": {"rows": 6, "class": "form-control", "placeholder": "link ảnh"}
        }
    }

    async def scaffold_form(self, *args, **kwargs):
        form_class = await super().scaffold_form(*args, **kwargs)
        form_class.upload_new_images = MultipleFileField("Tải ảnh từ thiết bị", widget=AutoUploadWidget())
        return form_class

    async def on_model_change(self, data: dict, model: any, is_created: bool, request):
        data.pop("upload_new_images", None)
        await super().on_model_change(data, model, is_created, request)