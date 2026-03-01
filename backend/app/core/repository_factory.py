from sqlalchemy.orm import Session

from app.v1.projects.repository import ProjectRepository
from app.v1.introductions.repository import IntroductionRepository
from app.v1.blogs.repository import BlogRepository
from app.v1.keywords.repository import KeywordRepository
from app.v1.users.repository import UserRepository
from app.v1.public_events.repository import PublicEventRepository
from app.v1.posts.repository import PostRepository


class RepositoryFactory:
    """Factory để tạo và cache các Repository instances.

    Tất cả repositories chia sẻ cùng 1 db session trong mỗi request.
    """

    def __init__(self, db: Session):
        self._db = db
        self._cache: dict = {}

    @property
    def db(self) -> Session:
        return self._db

    @property
    def project(self) -> ProjectRepository:
        if "project" not in self._cache:
            self._cache["project"] = ProjectRepository(self._db)
        return self._cache["project"]

    @property
    def introduction(self) -> IntroductionRepository:
        if "introduction" not in self._cache:
            self._cache["introduction"] = IntroductionRepository(self._db)
        return self._cache["introduction"]

    @property
    def blog(self) -> BlogRepository:
        if "blog" not in self._cache:
            self._cache["blog"] = BlogRepository(self._db)
        return self._cache["blog"]

    @property
    def keyword(self) -> KeywordRepository:
        if "keyword" not in self._cache:
            self._cache["keyword"] = KeywordRepository(self._db)
        return self._cache["keyword"]

    @property
    def user(self) -> UserRepository:
        if "user" not in self._cache:
            self._cache["user"] = UserRepository(self._db)
        return self._cache["user"]

    @property
    def public_event(self) -> PublicEventRepository:
        if "public_event" not in self._cache:
            self._cache["public_event"] = PublicEventRepository(self._db)
        return self._cache["public_event"]

    @property
    def post(self) -> PostRepository:
        if "post" not in self._cache:
            self._cache["post"] = PostRepository(self._db)
        return self._cache["post"]
