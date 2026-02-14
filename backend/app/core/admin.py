from sqladmin import ModelView


class BaseAdmin(ModelView):
    """Base admin class with Markdown editor template."""

    edit_template = "markdown_edit.html"
    create_template = "markdown_create.html"
