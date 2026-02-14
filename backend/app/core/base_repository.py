from typing import TypeVar, Generic, Type
from sqlalchemy.orm import Session
from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Base repository với các CRUD operations chung.

    Kế thừa class này, chỉ cần truyền model vào là xong.
    Nếu cần custom query, override method tương ứng.
    """

    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db = db

    def get_all(self) -> list[ModelType]:
        return self.db.query(self.model).all()

    def get_by_id(self, id: int) -> ModelType | None:
        return self.db.query(self.model).filter(self.model.id == id).first()

    def create(self, **kwargs) -> ModelType:
        instance = self.model(**kwargs)
        self.db.add(instance)
        self.db.commit()
        self.db.refresh(instance)
        return instance

    def update(self, instance: ModelType, **kwargs) -> ModelType:
        for key, value in kwargs.items():
            if value is not None:
                setattr(instance, key, value)
        self.db.commit()
        self.db.refresh(instance)
        return instance

    def delete(self, instance: ModelType) -> None:
        self.db.delete(instance)
        self.db.commit()
