from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: str = "5432"

    # External API
    DUT_MANAGER_API_KEY: str = ""

    # MinIO
    MINIO_ENDPOINT: str = "minio.dutai.site"
    MINIO_ACCESS_KEY: str = ""
    MINIO_SECRET_KEY: str = ""
    MINIO_BUCKET_NAME: str = "dut-ai-manager-prod"
    MINIO_SECURE: bool = True

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent.parent.parent.parent / ".env",
        extra="ignore",
    )


settings = Settings()
