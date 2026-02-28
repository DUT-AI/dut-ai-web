from sqladmin import Admin

from app.v1.projects.admin import ProjectAdmin
from app.v1.introductions.admin import IntroductionAdmin
from app.v1.blogs.admin import BlogAdmin 
from app.v1.events.admin import WorkshopAdmin, MemorableEventAdmin
from app.v1.members.admin import MemberAdmin


admin_views = [
    ProjectAdmin,
    IntroductionAdmin,
    BlogAdmin, 
    WorkshopAdmin,
    MemorableEventAdmin,  
    MemberAdmin,
]

def register_admin_views(admin: Admin) -> None:
    """Register tất cả admin views của v1 vào Admin instance."""
    for view in admin_views:
        admin.add_view(view) 