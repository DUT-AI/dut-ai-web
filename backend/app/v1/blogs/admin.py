from app.core.admin import BaseAdmin
from .models import Blog

class BlogAdmin(BaseAdmin, model=Blog):
    name = "Bài viết"
    name_plural = "Quản lý Blogs"
    icon = "fa-solid fa-file-pen"
    
    column_list = [Blog.id, Blog.title, Blog.views, Blog.created_at]
    form_columns = [Blog.title, Blog.content, Blog.authors, Blog.keywords]
    column_searchable_list = [Blog.title, Blog.keywords]