from sqlalchemy.orm import Session
from app.v1.projects.service import ProjectService
from app.v1.introductions.service import IntroductionService
from app.v1.users.service import UserService
from app.v1.media.service import MinioService
from app.v1.blogs.service import BlogService
from app.v1.keywords.service import KeywordService
from app.v1.homepage.service import HomepageService
from app.v1.public_events.service import PublicEventService
from app.v1.posts.service import PostService
from app.admin_v2.service import AdminService
from .repository_factory import RepositoryFactory


class ServiceFactory:
    """Factory để tạo và cache các Service instances.

    Services có thể phụ thuộc lẫn nhau thông qua factory này.
    """

    def __init__(self, repo_factory: RepositoryFactory):
        self._repo = repo_factory
        self._cache: dict = {}

    @property
    def db(self) -> Session:
        return self._repo.db

    @property
    def admin(self) -> AdminService:
        if "admin" not in self._cache:
            self._cache["admin"] = AdminService(self)
        return self._cache["admin"]

    @property
    def project(self) -> ProjectService:
        if "project" not in self._cache:
            self._cache["project"] = ProjectService(self._repo.project, self.media)
        return self._cache["project"]

    @property
    def introduction(self) -> IntroductionService:
        if "introduction" not in self._cache:
            self._cache["introduction"] = IntroductionService(self._repo.introduction)
        return self._cache["introduction"]

    @property
    def user(self) -> UserService:
        if "user" not in self._cache:
            self._cache["user"] = UserService(self._repo.user)
        return self._cache["user"]

    @property
    def media(self) -> MinioService:
        if "media" not in self._cache:
            self._cache["media"] = MinioService()
        return self._cache["media"]

    @property
    def blog(self) -> BlogService:
        if "blog" not in self._cache:
            # BlogService needs KeywordService, so it uses ServiceFactory
            self._cache["blog"] = BlogService(self._repo.blog, self)
        return self._cache["blog"]

    @property
    def keyword(self) -> KeywordService:
        if "keyword" not in self._cache:
            self._cache["keyword"] = KeywordService(self._repo.keyword)
        return self._cache["keyword"]

    @property
    def homepage(self) -> HomepageService:
        if "homepage" not in self._cache:
            self._cache["homepage"] = HomepageService(self)
        return self._cache["homepage"]

    @property
    def public_event(self) -> PublicEventService:
        if "public_event" not in self._cache:
            self._cache["public_event"] = PublicEventService(self._repo.public_event)
        return self._cache["public_event"]

    @property
    def post(self) -> PostService:
        if "post" not in self._cache:
            self._cache["post"] = PostService(self._repo.post)
        return self._cache["post"]
