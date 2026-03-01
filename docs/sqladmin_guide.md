# Hướng dẫn sử dụng SQLAdmin cho DUT-AI

Tài liệu này hướng dẫn cách cấu hình, tùy chỉnh và mở rộng giao diện Admin sử dụng thư viện `sqladmin`.

## 1. Cấu hình cơ bản

Admin được khởi tạo trong `app/main.py`:

```python
from sqladmin import Admin
from app.core.database import engine

admin = Admin(app, engine, templates_dir="app/templates")
```

Các View được đăng ký tập trung tại `app/v1/v1_admin.py`.

## 2. ModelView căn bản

Mỗi bảng database cần một class kế thừa từ `ModelView` (hoặc `BaseAdmin` nếu có dùng Markdown):

```python
class UserAdmin(BaseAdmin, model=User):
    column_list = [User.id, User.name, User.email]
    column_searchable_list = [User.name, User.email]
    name = "Người dùng"
    icon = "fa-solid fa-users"
```

## 3. Tùy chỉnh Quan hệ (Relationships)

### AJAX Searchable Tags (Khuyên dùng)
Tránh dùng dropdown dài dằng dặc. Sử dụng `form_ajax_refs` để tạo thanh tìm kiếm:

```python
class BlogAdmin(BaseAdmin, model=Blog):
    form_ajax_refs = {
        "authors_rel": {
            "fields": ("name", "email"),
            "order_by": ("name",),
        },
        "keywords_rel": {
            "fields": ("name",),
        }
    }
```

## 4. Thêm nút bấm/Trang tùy chỉnh (@expose)

Bạn có thể thêm các logic riêng (như nút Sync) vào giao diện Admin.

### Bước 1: Định nghĩa endpoint trong Admin class
Dùng decorator `@expose`.

```python
class UserAdmin(BaseAdmin, model=User):
    @expose("/sync", methods=["GET"])
    async def sync_user(self, request):
        # Logic xử lý tại đây
        return RedirectResponse(url=request.url_for("admin:list", identity=self.identity))
```

### Bước 2: Tạo template để hiển thị nút bấm
Tạo file template mới (ví dụ: `app/templates/user_list.html`) kế thừa từ `sqladmin/list.html`:

```html
{% extends "sqladmin/list.html" %}

{% block content_header %}
<div class="row align-items-center">
  <div class="col">
    <h2 class="page-title">{{ model_view.name_plural }}</h2>
  </div>
  <div class="col-auto ms-auto">
    <div class="btn-list">
      <!-- QUAN TRỌNG: Tên route là admin:view-{identity}-{method_name} -->
      <a href="{{ url_for('admin:view-user-sync_user') }}" class="btn btn-warning">
        <i class="fa-solid fa-sync me-2"></i> Đồng bộ User
      </a>
    </div>
  </div>
</div>
{% endblock %}
```

### Bước 3: Gắn template vào Admin class

```python
class UserAdmin(BaseAdmin, model=User):
    list_template = "user_list.html"
```

## 5. Xử lý Upload Media

Chúng ta sử dụng một module `media` tập trung để xử lý upload lên Minio/S3.

### Cấu hình Widget Upload trong Admin:
Trong `admin.py` của module (ví dụ `blogs/admin.py`):

```python
from app.v1.media.widgets import AutoUploadWidget

class BlogAdmin(BaseAdmin, model=Blog):
    form_extra_fields = {
        "image_url": AutoUploadWidget(
            label="Ảnh bìa",
            upload_url="/api/v1/media/upload" # Endpoint chung
        )
    }
```

## 6. Kiến thức chuyên sâu từ Source Code

Trong quá trình tìm hiểu mã nguồn thư viện (`sqladmin/application.py` và `sqladmin/models.py`), dưới đây là các quy tắc quan trọng:

### A. Quy tắc đặt tên Route (Internal Naming)
`sqladmin` sử dụng các tiền tố cố định để đăng ký route với Starlette/FastAPI:

- **Hàm `@expose` (trong ModelView):** `admin:view-{identity}-{method_name}`
  - Ví dụ: `admin:view-user-sync_user`
- **Hàm `@action` (trong ModelView):** `admin:action-{identity}-{slug}`
- **Route mặc định:**
  - Danh sách: `admin:list` (cần tham số `identity`)
  - Tạo mới: `admin:create` (cần tham số `identity`)
  - Sửa: `admin:edit` (cần `identity` và `pk`)
  - Chi tiết: `admin:details` (cần `identity` và `pk`)

### B. Phân biệt @expose và @action
- **`@expose(path, methods)`:** Tạo một URL hoàn toàn mới. Thường dùng để thay thế template hoặc tạo trang báo cáo riêng. Phải tự thêm nút bấm vào template nếu muốn người dùng truy cập được.
- **`@action(name, label)`:** Tương tự expose nhưng được **tự động thêm vào menu "Actions"** (nút dropdown có checkbox) trong trang danh sách. Thích hợp cho các thao tác trên nhiều bản ghi cùng lúc (nhận vào danh sách `pks`).

### C. Identity Mapping
Nếu bạn không khai báo `identity` trong Admin class, nó sẽ tự động tạo bằng cách:
`slugify_class_name(Model.__name__)`
- `Blog` -> `blog`
- `PublicEvent` -> `public-event`

### D. Custom Formatters
Bạn có thể tùy biến cách hiển thị một cột mà không cần sửa model:

```python
class BlogAdmin(BaseAdmin, model=Blog):
    column_formatters = {
        Blog.content: lambda m, a: m.content[:100] + "...",
        "custom_col": lambda m, a: f"ID của tôi là {m.id}"
    }
```

### E. Ghi đè Template (Template Inheritance)
Khi tạo template tùy chỉnh (như `user_list.html`), bạn nên kế thừa và ghi đè các `block` đúng lớp:

- **Lớp list (sqladmin/list.html):** Các block như `content`, `card_header`, `table`...
- **Lớp layout (sqladmin/layout.html):** Block `content_header` (nằm phía trên card danh sách - rất tốt để đặt các nút chức năng chính).

### F. AJAX Lookup Logic
Tính năng `form_ajax_refs` hoạt động bằng cách tạo một endpoint ngầm tại:
`/{identity}/ajax/lookup?name={field_name}&term={search_string}`
Phản hồi trả về định dạng JSON: `{"results": [{"id": 1, "text": "Label"}]}`.
