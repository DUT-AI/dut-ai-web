from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.v1.v1_router import v1_router

app = FastAPI(title="DUT-AI Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

app.include_router(v1_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Welcome to DUT-AI Backend API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}