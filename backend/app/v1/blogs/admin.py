from app.core.admin import BaseAdmin
from markupsafe import Markup
from wtforms import Form, MultipleFileField, TextAreaField, fields, widgets

from .models import Blog


# --- CUSTOM FIELD: cho phép nhập tag mới (bypass validation) ---
class TaggableSelectMultipleField(fields.SelectMultipleField):
    """Select field cho phép tạo tag mới ngoài danh sách có sẵn."""

    widget = widgets.Select(multiple=True)

    def pre_validate(self, form: Form) -> None:
        # Bỏ qua validation — cho phép cả ID và tag name mới
        pass


# --- CHẾ TẠO NÚT BẤM CÓ GẮN BỘ NÃO JAVASCRIPT ---
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
                                const response = await fetch('/api/v1/media/upload?folder=blogs', {{
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

                // --- SELECT2 TAGGING ---
                const reinitSelect2 = () => {{
                    const $kw = jQuery('select[name="keywords_rel"]');
                    if ($kw.length) {{
                        const s2 = $kw.data('select2');
                        if (s2) $kw.select2('destroy');
                        
                        $kw.select2({{
                            tags: true,
                            tokenSeparators: [','],
                            width: '100%',
                            placeholder: "Tìm kiếm hoặc gõ từ khóa mới...",
                            createTag: function (params) {{
                                var term = jQuery.trim(params.term);
                                if (term === '') return null;
                                return {{
                                    id: term,
                                    text: term,
                                    newTag: true
                                }};
                            }}
                        }});
                    }} else {{
                        setTimeout(reinitSelect2, 500);
                    }}
                }};
                setTimeout(reinitSelect2, 1000);
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

    form_ajax_refs = {
        "authors_rel": {
            "fields": ("name",),
            "placeholder": "Tìm kiếm tác giả...",
        },
    }

    form_overrides = {
        "image_url": TextAreaField,
    }
    form_args = {
        "image_url": {
            "render_kw": {
                "rows": 6,
                "class": "form-control",
                "placeholder": "link ảnh...",
            }
        },
    }

    async def scaffold_form(self, *args, **kwargs):
        form_class = await super().scaffold_form(*args, **kwargs)

        # Replace keywords_rel field with our TaggableSelectMultipleField
        original_field = getattr(form_class, "keywords_rel", None)
        if original_field:
            from app.v1.keywords.models import Keyword
            from app.core.database import SessionLocal

            # Get existing keywords for choices
            with SessionLocal() as session:
                keywords = session.query(Keyword).all()
                choices = [(str(kw.id), kw.keyword_name) for kw in keywords]

            form_class.keywords_rel = TaggableSelectMultipleField(
                label="Keywords Rel",
                choices=choices,
                render_kw={"class": "form-control"},
            )

        form_class.upload_new_images = MultipleFileField(
            "Tải thêm ảnh mới (Tự động up và nhả link ngay lập tức)",
            widget=AutoUploadWidget(),
        )
        return form_class

    async def on_model_change(self, data: dict, model: any, is_created: bool, request):
        data.pop("upload_new_images", None)

        # Handle keywords: create new ones, convert all to integer IDs
        if "keywords_rel" in data:
            keyword_items = data.get("keywords_rel", [])
            if not isinstance(keyword_items, (list, set)):
                keyword_items = [keyword_items] if keyword_items else []

            resolved_ids = []
            with self.session_maker() as session:
                from app.v1.keywords.models import Keyword

                for item in keyword_items:
                    if not item:
                        continue
                    item_str = str(item).strip()
                    if not item_str:
                        continue

                    if item_str.isdigit():
                        resolved_ids.append(str(item_str))
                    else:
                        # New keyword — get or create
                        kw = (
                            session.query(Keyword)
                            .filter(Keyword.keyword_name == item_str)
                            .first()
                        )
                        if not kw:
                            kw = Keyword(keyword_name=item_str, number_blog_contain=0)
                            session.add(kw)
                            session.flush()
                        resolved_ids.append(str(kw.id))

                session.commit()

            data["keywords_rel"] = resolved_ids

        await super().on_model_change(data, model, is_created, request)
