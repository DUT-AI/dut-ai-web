from app.core.admin import BaseAdmin
from app.v1.users.models import User


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
