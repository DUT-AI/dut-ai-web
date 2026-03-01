from .schemas import HomepageResponse


class HomepageService:
    def __init__(self, service_factory):
        self._factory = service_factory

    def get_homepage_data(self, limit: int = 5) -> HomepageResponse:
        """Lấy dữ liệu trang chủ từ các service khác."""
        # Homepage is a coordinator, so it calls other services.

        # Lấy projects
        latest_projects = self._factory.project.get_all()[:limit]

        # Lấy public_events thay thế cho Event chung
        latest_events = self._factory.public_event.get_all()[:limit]

        # Lấy blogs
        latest_blogs = self._factory.blog.get_all_blogs(limit=limit)

        return HomepageResponse(
            latest_projects=latest_projects,
            latest_events=latest_events,
            latest_blogs=latest_blogs,
        )
