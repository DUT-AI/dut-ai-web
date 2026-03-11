import secrets

from sqladmin.authentication import AuthenticationBackend
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import RedirectResponse

from app.core.config import settings


def set_admin_session(request: Request) -> None:
    token = secrets.token_hex(32)
    request.session.update(
        {
            "admin_token": token,
            "admin_user": {
                "username": settings.ADMIN_USERNAME,
                "role_name": "admin",
                "status": "active",
            },
        }
    )


def clear_admin_session(request: Request) -> None:
    request.session.clear()


def is_admin_logged_in(request: Request) -> bool:
    session = request.scope.get("session") or {}
    admin_user = session.get("admin_user")

    if not admin_user:
        return False

    return (
        admin_user.get("role_name") == "admin"
        and admin_user.get("status") == "active"
    )


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()

        username = (form.get("username") or "").strip()
        password = (form.get("password") or "").strip()

        if (
            username == settings.ADMIN_USERNAME
            and password == settings.ADMIN_PASSWORD
        ):
            set_admin_session(request)
            return True

        return False

    async def logout(self, request: Request) -> bool:
        clear_admin_session(request)
        return True

    async def authenticate(self, request: Request) -> RedirectResponse | bool:
        if not is_admin_logged_in(request):
            return RedirectResponse(request.url_for("admin:login"), status_code=302)

        return True
    
class AdminAuthMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app,
        protected_prefix: str = "/admin_v2",
        excluded_paths: set[str] | None = None,
    ):
        super().__init__(app)
        self.protected_prefix = protected_prefix.rstrip("/")
        self.excluded_paths = excluded_paths or set()

    async def dispatch(self, request: Request, call_next):
        path = request.url.path.rstrip("/") or "/"

        is_protected = path.startswith(self.protected_prefix)
        is_excluded = path in self.excluded_paths

        if is_protected and not is_excluded:
            if not is_admin_logged_in(request):
                return RedirectResponse(url="/admin_v2/login", status_code=303)

        return await call_next(request)