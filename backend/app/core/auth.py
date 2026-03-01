import secrets

from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.responses import RedirectResponse

from app.core.config import settings


class AdminAuth(AuthenticationBackend):
    """Simple password-based authentication for SQLAdmin."""

    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")

        if username == settings.ADMIN_USERNAME and password == settings.ADMIN_PASSWORD:
            # Generate a session token and store in session
            token = secrets.token_hex(32)
            request.session.update({"admin_token": token})
            return True

        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> RedirectResponse | bool:
        token = request.session.get("admin_token")

        if not token:
            return RedirectResponse(request.url_for("admin:login"), status_code=302)

        return True
