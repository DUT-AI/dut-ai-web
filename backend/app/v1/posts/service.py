from app.core.base_service import BaseService
from .models import Post
from .schemas import PostCreate, PostUpdate


class PostService(BaseService[Post, PostCreate, PostUpdate]):
    def __init__(self, repo):
        super().__init__(repo, entity_name="Post")
        self.repo = repo
