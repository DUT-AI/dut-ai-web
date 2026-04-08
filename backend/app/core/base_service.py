from typing import TypeVar, Generic
from fastapi import HTTPException
from pydantic import BaseModel
from app.core.base_repository import BaseRepository

ModelType = TypeVar("ModelType")
CreateSchema = TypeVar("CreateSchema", bound=BaseModel)
UpdateSchema = TypeVar("UpdateSchema", bound=BaseModel)


class BaseService(Generic[ModelType, CreateSchema, UpdateSchema]):
    """Base service với business logic chung.

    Kế thừa class này, truyền entity_name để customize error messages.
    Nếu cần thêm logic, override method tương ứng.
    """

    def __init__(self, repo: BaseRepository, entity_name: str = "Resource"):
        self.repo = repo
        self.entity_name = entity_name

    def get_all(self) -> list[ModelType]:
        return self.repo.get_all()

    def get_by_id(self, id: int) -> ModelType:
        instance = self.repo.get_by_id(id)
        if not instance:
            raise HTTPException(
                status_code=404,
                detail=f"{self.entity_name} not found",
            )
        return instance

    def create(self, data: CreateSchema) -> ModelType:
        return self.repo.create(**data.model_dump(exclude_none=True))

    def update(self, id: int, data: UpdateSchema) -> ModelType:
        instance = self.get_by_id(id)
        return self.repo.update(
            instance,
            **data.model_dump(exclude_unset=True, exclude_none=True)
        )

    def delete(self, id: int) -> None:
        instance = self.get_by_id(id)
        self.repo.delete(instance)