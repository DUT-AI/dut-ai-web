from app.core.admin import BaseAdmin
from .models import Project
from wtforms import MultipleFileField, widgets, TextAreaField
from markupsafe import Markup


class AutoUploadWidget(widgets.FileInput):
    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)
        kwargs.setdefault("multiple", True)
        html = super().__call__(field, **kwargs)

        script = f"""
        <script>
            setTimeout(() => {{
                const fileInput = document.getElementById('{field.id}');
                const urlInput = document.getElementById('image_url');
                
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
                                // Gọi API riêng của Projects
                                const response = await fetch('/api/v1/media/upload?folder=projects', {{
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


class ProjectAdmin(BaseAdmin, model=Project):
    name = "Dự án"
    name_plural = "Projects"
    icon = "fa-solid fa-briefcase"

    column_list = [
        Project.id,
        Project.title,
        Project.description,
        Project.image_url,
        Project.project_url,
    ]

    form_columns = [
        Project.title,
        Project.description,
        Project.project_url,
        Project.image_url,
    ]

    form_overrides = {"image_url": TextAreaField}
    form_args = {
        "image_url": {
            "render_kw": {"rows": 6, "class": "form-control", "placeholder": "link ảnh"}
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
        await super().on_model_change(data, model, is_created, request)
