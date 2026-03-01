from app.core.admin import BaseAdmin
from app.v1.blogs.models import Keyword


class KeywordAdmin(BaseAdmin, model=Keyword):
    name = "Từ khóa"
    name_plural = "Keywords"
    icon = "fa-solid fa-tags"
    column_list = [Keyword.id, Keyword.keyword_name, Keyword.number_blog_contain]
    form_columns = [Keyword.keyword_name]
    column_searchable_list = [Keyword.keyword_name]
