from app.core.database import engine, Base

from app.v1.projects.models import Project  # noqa: F401
from app.v1.introductions.models import Introduction  # noqa: F401
from app.v1.blogs.models import Blog  # noqa: F401
from app.v1.public_events.models import Event  # noqa: F401
from app.v1.users.models import User  # noqa: F401
from app.v1.keywords.models import Keyword  # noqa: F401
from app.v1.posts.models import Post  # noqa: F401


def init():
    print("Đang kiểm tra và tạo các bảng...")
    Base.metadata.create_all(bind=engine)
    print("Tables created!")


if __name__ == "__main__":
    init()
