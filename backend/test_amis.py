from fastapi import FastAPI
from fastapi_amis_admin.admin.settings import Settings
from fastapi_amis_admin.admin.site import AdminSite
from fastapi_amis_admin.admin import admin
from app.v1.projects.models import Project

app = FastAPI()
site = AdminSite(
    settings=Settings(database_url_async="sqlite+aiosqlite:///amisadmin.db")
)


class ProjectAdmin(admin.ModelAdmin):
    page_schema = "Project"
    model = Project


try:
    site.register_admin(ProjectAdmin)
    site.mount_app(app)
    print("Mounted successfully")
except Exception as e:
    print(f"Error: {e}")
