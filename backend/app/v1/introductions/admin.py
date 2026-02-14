from app.core.admin import BaseAdmin
from .models import Introduction


class IntroductionAdmin(BaseAdmin, model=Introduction):
    name = "Introduction"
    icon = "fa-solid fa-file-lines"
    column_list = [Introduction.id, Introduction.content]
    form_columns = [Introduction.content]
