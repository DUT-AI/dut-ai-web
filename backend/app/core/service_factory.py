from app.v1.projects.service import ProjectService
from app.v1.introductions.service import IntroductionService
from app.v1.members.service import MemberService
from app.v1.media.service import MinioService
from .repository_factory import RepositoryFactory


class ServiceFactory:
    """Factory để tạo và cache các Service instances.

    Services có thể phụ thuộc lẫn nhau thông qua factory này.
    """

    def __init__(self, repo_factory: RepositoryFactory):
        self._repo = repo_factory
        self._cache: dict = {}

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
    def member(self) -> MemberService:
        if "member" not in self._cache:
            self._cache["member"] = MemberService()
        return self._cache["member"]

    @property
    def media(self) -> MinioService:
        if "media" not in self._cache:
            self._cache["media"] = MinioService()
        return self._cache["media"]
