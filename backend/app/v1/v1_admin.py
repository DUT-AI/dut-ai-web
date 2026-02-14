from sqladmin import Admin

from app.v1.projects.admin import ProjectAdmin
from app.v1.introductions.admin import IntroductionAdmin

# Thêm feature mới chỉ cần import và thêm vào list này
admin_views = [
    ProjectAdmin,
    IntroductionAdmin,
]


def register_admin_views(admin: Admin) -> None:
    """Register tất cả admin views của v1 vào Admin instance."""
    for view in admin_views:
        admin.add_view(view)
