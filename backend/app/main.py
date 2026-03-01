from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin

from app.core.database import engine
from app.v1.v1_admin import register_admin_views
from app.v1.v1_router import v1_router


app = FastAPI(title="DUT-AI FastAPI Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Trong môi trường dev có thể để "*" hoặc cụ thể http://localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Admin
admin = Admin(app, engine, templates_dir="app/templates")
register_admin_views(admin)

# API routers
app.include_router(v1_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Welcome to DUT-AI FastAPI Backend"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
