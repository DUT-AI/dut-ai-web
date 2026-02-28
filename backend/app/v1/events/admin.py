from app.core.admin import BaseAdmin
from .models import Event
from wtforms import MultipleFileField, widgets, TextAreaField, SelectField
from markupsafe import Markup

class AutoUploadWidget(widgets.FileInput):
    def __call__(self, field, **kwargs):
        kwargs.setdefault('id', field.id)
        kwargs.setdefault('multiple', True)
        html = super().__call__(field, **kwargs)
        
        script = f"""
        <script>
            setTimeout(() => {{
                const fileInput = document.getElementById('{field.id}');
                const urlInput = document.getElementById('image_url');
                
                if(fileInput && urlInput) {{
                    // Tính năng thông minh: Tự động chuyển dấu phẩy thành xuống dòng
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
                                // GỌI API BÊN EVENTS
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

class EventAdmin(BaseAdmin, model=Event):
    name = "Sự kiện"
    name_plural = "Events"
    icon = "fa-solid fa-calendar-days"

    column_list = [Event.id, Event.title, Event.event_type, Event.event_date, Event.updated_at]

    form_columns = [
        Event.event_type, 
        Event.title, 
        Event.description, 
        Event.event_date, 
        Event.location, 
        Event.registration_link,
        Event.hashtags,
        Event.image_url
    ]
    
    column_searchable_list = [Event.title, Event.location, Event.hashtags]
    form_overrides = {
        "image_url": TextAreaField,
        "event_type": SelectField
    }
    form_args = {
        "event_type": {
            "choices": [
                ("workshop", "Workshops & Seminar"),  
                ("memorable", "Sự kiện đáng nhớ")
            ],
            "default": "workshop" 
        },

        "image_url": {
            "render_kw": {
                "rows": 6, 
                "class": "form-control",
                "placeholder": "link ảnh"
            }
        }
    }

    async def scaffold_form(self, *args, **kwargs):
        form_class = await super().scaffold_form(*args, **kwargs)
        form_class.upload_new_images = MultipleFileField(
            "Tải ảnh từ thiết bị", 
            widget=AutoUploadWidget()
        )
        return form_class

    async def on_model_change(self, data: dict, model: any, is_created: bool, request):
        # Dọn dẹp trường ảo
        data.pop("upload_new_images", None)
        await super().on_model_change(data, model, is_created, request)