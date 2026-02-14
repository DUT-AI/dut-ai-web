from app.core.database import engine, Base

# Import all models so Base.metadata knows about them
from app.v1.projects.models import Project  # noqa: F401
from app.v1.introductions.models import Introduction  # noqa: F401


def init():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created!")


if __name__ == "__main__":
    init()
