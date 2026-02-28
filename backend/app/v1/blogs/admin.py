from app.core.admin import BaseAdmin
from .models import Blog
from wtforms import MultipleFileField, widgets, TextAreaField, SelectMultipleField
from markupsafe import Markup

import httpx
import os

from sqlalchemy import select
from app.v1.members.models import Member

from .models import Blog, Keyword
from app.v1.users.models import User
from wtforms import (
    MultipleFileField,
    widgets,
    TextAreaField,
)  # <--- Nhớ import TextAreaField
from markupsafe import Markup


# --- 1. CHẾ TẠO NÚT BẤM CÓ GẮN BỘ NÃO JAVASCRIPT ---
class AutoUploadWidget(widgets.FileInput):
    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)
        kwargs.setdefault("multiple", True)
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

class BlogAdmin(BaseAdmin, model=Blog):
    name = "Bài viết"
    name_plural = "Blogs"
    icon = "fa-solid fa-file-pen"

    column_list = [
        Blog.id,
        Blog.title,
        Blog.authors_rel,
        Blog.keywords_rel,
        Blog.views,
        Blog.created_at,
    ]
    form_columns = [
        Blog.title,
        Blog.content,
        Blog.authors_rel,
        Blog.keywords_rel,
        Blog.image_url,
    ]
    column_searchable_list = [Blog.title]

    form_overrides = {
        "image_url": TextAreaField,
        "authors": SelectMultipleField
    }
    form_args = {
        "image_url": {
            "render_kw": {
                "rows": 6,
                "class": "form-control",
                "placeholder": "link ảnh...",
            }
        }
    }

    async def scaffold_form(self, *args, **kwargs):
        form_class = await super().scaffold_form(*args, **kwargs)

        try:
            with self.session_maker() as session:
                result = session.execute(select(Member))
                members = result.scalars().all()
                
                choices = [(m.name, m.name) for m in members if getattr(m, 'name', None)]
                
                if choices:
                    form_class.authors.kwargs['choices'] = choices
                else:
                    form_class.authors.kwargs['choices'] = [("", "Chưa có ai (Vào mục Members thêm mới nhé)")]
                    
        except Exception as e:
            form_class.authors.kwargs['choices'] = [(f"Lỗi DB", f"Lỗi DB: {str(e)}")]

        form_class.upload_new_images = MultipleFileField(
            "Tải thêm ảnh mới (Tự động up và nhả link ngay lập tức)", 
            widget=AutoUploadWidget()
        )
        return form_class
    async def on_model_change(self, data: dict, model: any, is_created: bool, request):
        data.pop("upload_new_images", None)

        authors_list = data.get("authors")
        if authors_list and isinstance(authors_list, list):
            data["authors"] = ", ".join(authors_list)
        elif not authors_list:
            data["authors"] = ""

        await super().on_model_change(data, model, is_created, request)
        await super().on_model_change(data, model, is_created, request)


class KeywordAdmin(BaseAdmin, model=Keyword):
    name = "Từ khóa"
    name_plural = "Keywords"
    icon = "fa-solid fa-tags"
    column_list = [Keyword.id, Keyword.keyword_name, Keyword.number_blog_contain]
    form_columns = [Keyword.keyword_name]
    column_searchable_list = [Keyword.keyword_name]
