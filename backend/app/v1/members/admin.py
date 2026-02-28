from app.core.admin import BaseAdmin
from .models import Member

class MemberAdmin(BaseAdmin, model=Member):
    name = "Thành viên"
    name_plural = "Quản lý Members"
    icon = "fa-solid fa-users"
    
    column_list = [Member.id, Member.name, Member.email, Member.role_name]
    form_columns = [Member.name, Member.email, Member.role_name]
    column_searchable_list = [Member.name, Member.email]