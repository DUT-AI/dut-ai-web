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
                    const $kw = jQuery('select[name="keywords_tags"]');
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
        Blog.summary,
        Blog.authors_rel,
        Blog.keywords_rel,
        Blog.views,
        Blog.created_at,
    ]
    form_columns = [
        Blog.title,
        Blog.summary,
        Blog.content,
        Blog.authors_rel,
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
        "summary": TextAreaField,
    }
    form_args = {
        "image_url": {
            "render_kw": {
                "rows": 6,
                "class": "form-control",
                "placeholder": "link ảnh...",
            }
        },
        "summary": {
            "render_kw": {
                "rows": 3,
                "class": "form-control",
                "placeholder": "tóm tắt bài viết...",
            }
        },
    }

    async def scaffold_form(self, *args, **kwargs):
        form_class = await super().scaffold_form(*args, **kwargs)

        from app.v1.keywords.models import Keyword
        from app.core.database import SessionLocal

        # Get existing keywords for choices
        with SessionLocal() as session:
            keywords = session.query(Keyword).all()
            choices = [(str(kw.id), kw.keyword_name) for kw in keywords]

        form_class.keywords_tags = TaggableSelectMultipleField(
            label="Từ khóa",
            choices=choices,
            render_kw={"class": "form-control"},
        )

        form_class.upload_new_images = MultipleFileField(
            "Tải thêm ảnh mới (Tự động up và nhả link ngay lập tức)",
            widget=AutoUploadWidget(),
        )
        return form_class

    async def get_form(self, *args, **kwargs):
        form = await super().get_form(*args, **kwargs)
        obj = kwargs.get("obj")
        if obj and hasattr(obj, "keywords_rel"):
            form.keywords_tags.data = [str(kw.id) for kw in obj.keywords_rel]
        return form

    async def on_model_change(self, data: dict, model: any, is_created: bool, request):
        data.pop("upload_new_images", None)

        # Handle keywords: create new ones, manage relationship manually
        if "keywords_tags" in data:
            keyword_items = data.pop("keywords_tags", [])
            if not isinstance(keyword_items, (list, set)):
                keyword_items = [keyword_items] if keyword_items else []

            from sqlalchemy.orm import object_session
            from app.v1.keywords.models import Keyword

            # Get the session the model belongs to, or create a new one if not yet attached
            session = object_session(model)
            external_session = False

            if not session:
                session = self.session_maker()
                external_session = True

            try:
                resolved_objs = []
                for item in keyword_items:
                    if not item:
                        continue
                    item_str = str(item).strip()
                    if not item_str:
                        continue

                    kw = None
                    if item_str.isdigit():
                        kw = session.get(Keyword, int(item_str))

                    if not kw:
                        # Check keyword by name
                        kw = (
                            session.query(Keyword)
                            .filter(Keyword.keyword_name == item_str)
                            .first()
                        )
                        if not kw:
                            kw = Keyword(keyword_name=item_str, number_blog_contain=0)
                            session.add(kw)
                            session.flush()

                    if kw:
                        resolved_objs.append(kw)

                # Update relationship
                model.keywords_rel = resolved_objs

                if external_session:
                    session.commit()
            finally:
                if external_session:
                    session.close()

        await super().on_model_change(data, model, is_created, request)

    async def after_model_change(
        self, data: dict, model: any, is_created: bool, request
    ):
        """Auto-generate slug after model is saved (so we have the ID)."""
        from .models import generate_slug

        if is_created or not model.slug:
            from sqlalchemy.orm import object_session

            session = object_session(model)
            if session and model.id:
                model.slug = generate_slug(model.title, model.id)
                session.commit()
