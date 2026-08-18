from sqlalchemy.orm import Session


class RepositoryFactory:
    """Factory để tạo và cache các Repository instances."""

    def __init__(self, db: Session):
        self._db = db
        self._cache: dict = {}

    @property
    def db(self) -> Session:
        return self._db
