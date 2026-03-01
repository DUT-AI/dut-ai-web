from app.core.admin import BaseAdmin
from app.core.database import SessionLocal
from app.v1.users.models import User
from sqladmin import expose
from starlette.responses import RedirectResponse

from .repository import UserRepository
from .service import UserService


class UserAdmin(BaseAdmin, model=User):
    column_list = [
        User.id,
        User.name,
        User.email,
        User.role_name,
        User.status,
    ]
    column_searchable_list = [User.name, User.email]
    name = "Người dùng"
    name_plural = "Người dùng"
    icon = "fa-solid fa-users"

    list_template = "user_list.html"

    @expose("/sync", methods=["GET"])
    async def sync_user(self, request):

        db = SessionLocal()
        try:
            repo = UserRepository(db)
            service = UserService(repo)
            service.sync_users()
        finally:
            db.close()

        return RedirectResponse(
            url=request.url_for("admin:list", identity=self.identity)
        )
