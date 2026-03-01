import json

from app.core.admin import BaseAdmin
from app.core.database import SessionLocal
from .models import Project, ProjectMember
from app.v1.users.models import User
from wtforms import MultipleFileField, FileField as WTFileField, widgets, TextAreaField, Field
from markupsafe import Markup


# ─── WIDGET: Auto‑upload ảnh lên MinIO ───────────────────────────────────────

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


# ─── WIDGET: Auto‑upload video lên MinIO ──────────────────────────────────────

class VideoUploadWidget(widgets.FileInput):
    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)
        kwargs["accept"] = "video/mp4,video/webm,video/quicktime,video/*"
        html = super().__call__(field, **kwargs)

        script = f"""
        <script>
            setTimeout(() => {{
                const fileInput = document.getElementById('{field.id}');
                const urlInput = document.getElementById('video_url');
                
                if(fileInput && urlInput) {{
                    fileInput.addEventListener('change', async function(e) {{
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        const originalValue = urlInput.value;
                        urlInput.value = "⏳ Đang tải video " + file.name + " (" + (file.size / 1024 / 1024).toFixed(1) + "MB)...";
                        
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        try {{
                            const response = await fetch('/api/v1/media/upload?folder=projects/videos', {{
                                method: 'POST',
                                body: formData
                            }});
                            
                            if(response.ok) {{
                                const data = await response.json();
                                urlInput.value = data.url;
                            }} else {{
                                alert("Lỗi tải video!");
                                urlInput.value = originalValue;
                            }}
                        }} catch (err) {{
                            alert("Lỗi kết nối!");
                            urlInput.value = originalValue;
                        }}
                        fileInput.value = '';
                    }});
                }}
            }}, 500);
        </script>
        """
        return html + Markup(script)


# ─── WIDGET: Inline member (user + roles) ────────────────────────────────────

class MemberInlineWidget:
    """Render giao diện inline để chọn user + nhập roles cho mỗi thành viên."""

    def __call__(self, field, **kwargs):
        # Current members data (JSON string)
        current_data = field.data or "[]"
        if isinstance(current_data, list):
            current_data = json.dumps(current_data, ensure_ascii=False)

        field_id = kwargs.get("id", field.id)

        html = f"""
        <div id="{field_id}-container" class="member-inline-container">
            <input type="hidden" id="{field_id}" name="{field.name}" value='{current_data}'>
            
            <table class="table table-bordered table-sm" id="{field_id}-table">
                <thead class="table-light">
                    <tr>
                        <th style="width: 35%">Thành viên</th>
                        <th style="width: 50%">Roles</th>
                        <th style="width: 15%">Thao tác</th>
                    </tr>
                </thead>
                <tbody id="{field_id}-body">
                </tbody>
            </table>
            
            <div class="card card-body bg-light mt-2 p-3">
                <div class="row g-2 align-items-end">
                    <div class="col-md-4">
                        <label class="form-label fw-bold mb-1">Chọn thành viên</label>
                        <select id="{field_id}-user-select" class="form-select">
                            <option value="">-- Chọn user --</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold mb-1">Chọn roles</label>
                        <div id="{field_id}-role-checkboxes" class="d-flex flex-wrap gap-2">
                            <label class="form-check form-check-inline mb-0"><input type="checkbox" class="form-check-input role-cb" value="Project Manager"> Project Manager</label>
                            <label class="form-check form-check-inline mb-0"><input type="checkbox" class="form-check-input role-cb" value="Designer"> Designer</label>
                            <label class="form-check form-check-inline mb-0"><input type="checkbox" class="form-check-input role-cb" value="Business Analysis"> Business Analysis</label>
                            <label class="form-check form-check-inline mb-0"><input type="checkbox" class="form-check-input role-cb" value="BackEnd Developer"> BackEnd Developer</label>
                            <label class="form-check form-check-inline mb-0"><input type="checkbox" class="form-check-input role-cb" value="FrontEnd Developer"> FrontEnd Developer</label>
                            <label class="form-check form-check-inline mb-0"><input type="checkbox" class="form-check-input role-cb" value="AI Developer"> AI Developer</label>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-success w-100" id="{field_id}-add-btn">
                            <i class="fa-solid fa-plus"></i> Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <script>
        (function() {{
            const fieldId = '{field_id}';
            const AVAILABLE_ROLES = ['Project Manager', 'Designer', 'Business Analysis', 'BackEnd Developer', 'FrontEnd Developer', 'AI Developer'];

            const hiddenInput = document.getElementById(fieldId);
            const tbody = document.getElementById(fieldId + '-body');
            const userSelect = document.getElementById(fieldId + '-user-select');
            const addBtn = document.getElementById(fieldId + '-add-btn');
            const roleCheckboxes = document.querySelectorAll(`#${{fieldId}}-role-checkboxes .role-cb`);

            // State
            let members = [];
            try {{
                members = JSON.parse(hiddenInput.value || '[]');
            }} catch(e) {{
                members = [];
            }}

            // Load users from API
            fetch('/api/v1/users')
                .then(r => r.json())
                .then(users => {{
                    users.forEach(u => {{
                        const opt = document.createElement('option');
                        opt.value = u.id;
                        opt.textContent = u.name + ' (' + u.email + ')';
                        opt.dataset.name = u.name;
                        userSelect.appendChild(opt);
                    }});
                }})
                .catch(err => console.error('Failed to load users:', err));

            function syncHidden() {{
                hiddenInput.value = JSON.stringify(members);
            }}

            function makeRoleCheckboxes(roles, idx) {{
                return AVAILABLE_ROLES.map(r => {{
                    const checked = roles.includes(r) ? 'checked' : '';
                    return `<label class="form-check form-check-inline mb-0" style="font-size:0.85rem;">
                        <input type="checkbox" class="form-check-input table-role-cb" data-idx="${{idx}}" value="${{r}}" ${{checked}}> ${{r}}
                    </label>`;
                }}).join('');
            }}

            function renderTable() {{
                tbody.innerHTML = '';
                if (members.length === 0) {{
                    tbody.innerHTML = '<tr><td colspan="3" class="text-muted text-center">Chưa có thành viên nào</td></tr>';
                    return;
                }}
                members.forEach((m, idx) => {{
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <strong>${{m.user_name}}</strong>
                            <small class="text-muted d-block">ID: ${{m.user_id}}</small>
                        </td>
                        <td>${{makeRoleCheckboxes(m.roles || [], idx)}}</td>
                        <td class="text-center">
                            <button type="button" class="btn btn-outline-danger btn-sm member-remove-btn" data-idx="${{idx}}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                }});

                // Bind role checkbox change in table
                document.querySelectorAll(`#${{fieldId}}-body .table-role-cb`).forEach(cb => {{
                    cb.addEventListener('change', function() {{
                        const i = parseInt(this.dataset.idx);
                        const allCbs = document.querySelectorAll(`#${{fieldId}}-body .table-role-cb[data-idx="${{i}}"]`);
                        members[i].roles = Array.from(allCbs).filter(c => c.checked).map(c => c.value);
                        syncHidden();
                    }});
                }});

                // Bind remove
                document.querySelectorAll(`#${{fieldId}}-body .member-remove-btn`).forEach(btn => {{
                    btn.addEventListener('click', function() {{
                        const i = parseInt(this.dataset.idx);
                        members.splice(i, 1);
                        syncHidden();
                        renderTable();
                    }});
                }});
            }}

            // Add member
            addBtn.addEventListener('click', function() {{
                const userId = parseInt(userSelect.value);
                if (!userId) {{
                    alert('Vui lòng chọn thành viên!');
                    return;
                }}

                const roles = Array.from(roleCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
                if (roles.length === 0) {{
                    alert('Vui lòng chọn ít nhất 1 role!');
                    return;
                }}

                const selectedOpt = userSelect.options[userSelect.selectedIndex];
                const userName = selectedOpt.dataset.name;

                // Check duplicate — merge roles
                const existing = members.find(m => m.user_id === userId);
                if (existing) {{
                    const newRoles = roles.filter(r => !existing.roles.includes(r));
                    existing.roles = [...existing.roles, ...newRoles];
                }} else {{
                    members.push({{ user_id: userId, user_name: userName, roles: roles }});
                }}

                syncHidden();
                renderTable();

                // Reset
                userSelect.value = '';
                roleCheckboxes.forEach(cb => cb.checked = false);
            }});

            // Initial render
            renderTable();
        }})();
        </script>

        <style>
            .member-inline-container .table {{ margin-bottom: 0.5rem; }}
            .member-inline-container .table th {{ font-size: 0.85rem; }}
            .member-inline-container .table td {{ vertical-align: middle; }}
        </style>
        """
        return Markup(html)


class MemberInlineField(Field):
    """Custom WTForms field để quản lý members inline (JSON data)."""

    widget = MemberInlineWidget()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.data = []

    def _value(self):
        return json.dumps(self.data, ensure_ascii=False) if self.data else "[]"

    def process_formdata(self, valuelist):
        if valuelist and valuelist[0]:
            try:
                self.data = json.loads(valuelist[0])
            except (json.JSONDecodeError, TypeError):
                self.data = []
        else:
            self.data = []

    def pre_validate(self, form):
        pass  # Cho phép mọi data


# ─── ADMIN: Project ──────────────────────────────────────────────────────────

class ProjectAdmin(BaseAdmin, model=Project):
    name = "Dự án"
    name_plural = "Projects"
    icon = "fa-solid fa-briefcase"

    column_list = [
        Project.id,
        Project.title,
        Project.image_url,
        Project.demo_url,
        Project.members,
    ]

    column_details_list = [
        Project.id,
        Project.title,
        Project.description,
        Project.features,
        Project.technologies,
        Project.demo_url,
        Project.video_url,
        Project.image_url,
        Project.members,
    ]

    # Không include members ở đây — sẽ thêm qua scaffold_form
    form_columns = [
        Project.title,
        Project.description,
        Project.features,
        Project.technologies,
        Project.demo_url,
        Project.video_url,
        Project.image_url,
    ]

    column_searchable_list = [Project.title]

    column_labels = {
        Project.id: "ID",
        Project.title: "Tên dự án",
        Project.description: "Mô tả ngắn",
        Project.features: "Tính năng chính (Markdown)",
        Project.technologies: "Công nghệ sử dụng (Markdown)",
        Project.demo_url: "Demo (Link website)",
        Project.video_url: "Video demo (Link)",
        Project.image_url: "Ảnh dự án",
        Project.members: "Thành viên",
    }

    form_overrides = {
        "image_url": TextAreaField,
        "features": TextAreaField,
        "technologies": TextAreaField,
        "description": TextAreaField,
    }
    form_args = {
        "image_url": {
            "render_kw": {"rows": 4, "class": "form-control", "placeholder": "link ảnh"}
        },
        "description": {
            "render_kw": {
                "rows": 3,
                "class": "form-control",
                "placeholder": "Mô tả tổng quan ngắn gọn về dự án...",
            }
        },
        "features": {
            "render_kw": {
                "rows": 8,
                "class": "form-control",
                "placeholder": "Nhập markdown — ví dụ:\n- Chat AI thông minh\n- Tìm kiếm ngữ nghĩa\n- Xử lý ngôn ngữ tự nhiên",
            }
        },
        "technologies": {
            "render_kw": {
                "rows": 8,
                "class": "form-control",
                "placeholder": "Nhập markdown — ví dụ:\n- **Backend**: FastAPI, PostgreSQL\n- **Frontend**: Next.js, TailwindCSS\n- **AI/ML**: PyTorch, LangChain",
            }
        },
    }

    async def scaffold_form(self, *args, **kwargs):
        form_class = await super().scaffold_form(*args, **kwargs)

        # Thêm custom field cho members
        form_class.project_members = MemberInlineField(label="Thành viên dự án")

        # Upload ảnh
        form_class.upload_new_images = MultipleFileField(
            "Tải ảnh từ thiết bị", widget=AutoUploadWidget()
        )

        # Upload video
        form_class.upload_video = WTFileField(
            "Tải video demo", widget=VideoUploadWidget()
        )

        return form_class

    async def on_model_change(self, data: dict, model: any, is_created: bool, request):
        data.pop("upload_new_images", None)
        data.pop("upload_video", None)

        # Xử lý members inline
        members_data = data.pop("project_members", None)
        if members_data is not None:
            if isinstance(members_data, str):
                try:
                    members_data = json.loads(members_data)
                except (json.JSONDecodeError, TypeError):
                    members_data = []

            # Gọi parent trước để model có ID (nếu tạo mới)
            await super().on_model_change(data, model, is_created, request)

            # Sync members
            with SessionLocal() as session:
                # Xoá members cũ
                session.query(ProjectMember).filter(
                    ProjectMember.project_id == model.id
                ).delete()

                # Tạo members mới
                for member_info in (members_data or []):
                    user_id = member_info.get("user_id")
                    roles = member_info.get("roles", [])
                    if not user_id or not roles:
                        continue
                    for role in roles:
                        session.add(ProjectMember(
                            project_id=model.id,
                            user_id=user_id,
                            role=role,
                        ))

                session.commit()
        else:
            await super().on_model_change(data, model, is_created, request)

    async def get_model_objects(self, request, model=None):
        """Load existing members into custom field when editing."""
        return await super().get_model_objects(request, model)

    async def _populate_member_field(self, model, form):
        """Populate the project_members field with existing data."""
        if model and model.id:
            members_data = []
            # Group by user
            user_roles = {}
            for m in (model.members or []):
                uid = m.user_id
                if uid not in user_roles:
                    user_roles[uid] = {
                        "user_id": uid,
                        "user_name": m.user.name if m.user else "Unknown",
                        "roles": [],
                    }
                user_roles[uid]["roles"].append(m.role)
            members_data = list(user_roles.values())
            form.project_members.data = members_data

    async def edit_form(self, obj):
        form = await super().edit_form(obj)
        await self._populate_member_field(obj, form)
        return form
