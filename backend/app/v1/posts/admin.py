from app.core.admin import BaseAdmin
from .models import Post
from wtforms import MultipleFileField, widgets, TextAreaField
from markupsafe import Markup


# --- NÚT UPLOAD ẢNH ---
class AutoUploadWidget(widgets.FileInput):
    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)
        kwargs.setdefault("multiple", True)
        html = super().__call__(field, **kwargs)

        script = f"""
        <script>
            setTimeout(() => {{
                const fileInput = document.getElementById('{field.id}');
                const urlInput = document.getElementById('img_urls');
                
                if(fileInput && urlInput) {{
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
                                const response = await fetch('/api/v1/media/upload?folder=posts', {{
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


class PostAdmin(BaseAdmin, model=Post):
    name = "Post"
    name_plural = "Posts"
    icon = "fa-solid fa-camera-retro"

    column_list = [Post.id, Post.title, Post.hashtag]
    form_columns = [
        Post.title,
        Post.description,
        Post.hashtag,
        Post.img_urls,
    ]

    column_searchable_list = [Post.title, Post.hashtag]
    form_overrides = {"img_urls": TextAreaField}
    form_args = {
        "img_urls": {
            "render_kw": {
                "rows": 6,
                "class": "form-control",
                "placeholder": "mỗi link ảnh một dòng",
            }
        }
    }

    async def scaffold_form(self, *args, **kwargs):
        form_class = await super().scaffold_form(*args, **kwargs)
        form_class.upload_new_images = MultipleFileField(
            "Tải ảnh từ thiết bị", widget=AutoUploadWidget()
        )
        return form_class

    async def on_model_change(self, data: dict, model: any, is_created: bool, request):
        data.pop("upload_new_images", None)

        # Chuyển chuỗi xuống dòng thành list cho ARRAY field
        if "img_urls" in data and isinstance(data["img_urls"], str):
            urls = [url.strip() for url in data["img_urls"].split("\n") if url.strip()]
            data["img_urls"] = urls

        await super().on_model_change(data, model, is_created, request)
