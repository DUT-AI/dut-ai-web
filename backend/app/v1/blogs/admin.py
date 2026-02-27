from app.core.admin import BaseAdmin
from .models import Blog
from wtforms import MultipleFileField, widgets, TextAreaField # <--- Nhớ import TextAreaField
from markupsafe import Markup

# --- 1. CHẾ TẠO NÚT BẤM CÓ GẮN BỘ NÃO JAVASCRIPT ---
class AutoUploadWidget(widgets.FileInput):
    def __call__(self, field, **kwargs):
        kwargs.setdefault('id', field.id)
        kwargs.setdefault('multiple', True)
        html = super().__call__(field, **kwargs)
        
        # Đã đổi toàn bộ dấu phẩy ',' thành ký tự xuống dòng '\n'
        script = f"""
        <script>
            setTimeout(() => {{
                const fileInput = document.getElementById('{field.id}');
                const urlInput = document.getElementById('image_url');
                
                if(fileInput && urlInput) {{
                    // Tính năng thông minh: Tự động chuyển dấu phẩy của bài cũ thành xuống dòng
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
                                const response = await fetch('/api/v1/blogs/upload-async', {{
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

# --- 2. GIAO DIỆN ADMIN CHÍNH ---
class BlogAdmin(BaseAdmin, model=Blog):
    name = "Bài viết"
    name_plural = "Blogs"
    icon = "fa-solid fa-file-pen"
    
    column_list = [Blog.id, Blog.title, Blog.views, Blog.created_at]
    form_columns = [Blog.title, Blog.content, Blog.authors, Blog.keywords, Blog.image_url] 
    column_searchable_list = [Blog.title, Blog.keywords]

    # --- ÉP Ô IMAGE_URL PHÌNH TO RA THÀNH 6 DÒNG ---
    form_overrides = {
        "image_url": TextAreaField
    }
    form_args = {
        "image_url": {
            "render_kw": {
                "rows": 6, 
                "class": "form-control",
                "placeholder": "link ảnh..."
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
        data.pop("upload_new_images", None)
        await super().on_model_change(data, model, is_created, request)