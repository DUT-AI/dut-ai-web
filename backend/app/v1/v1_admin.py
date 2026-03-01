from app.v1.blogs.admin import BlogAdmin
from app.v1.public_events.admin import PublicEventAdmin
from app.v1.posts.admin import PostAdmin
from app.v1.introductions.admin import IntroductionAdmin
from app.v1.keywords.admin import KeywordAdmin
from app.v1.projects.admin import ProjectAdmin
from app.v1.users.admin import UserAdmin
from sqladmin import Admin

admin_views = [
    ProjectAdmin,
    IntroductionAdmin,
    BlogAdmin,
    KeywordAdmin,
    PublicEventAdmin,
    PostAdmin,
    UserAdmin,
]


def register_admin_views(admin: Admin) -> None:
    """Register tất cả admin views của v1 vào Admin instance."""
    for view in admin_views:
        admin.add_view(view)
