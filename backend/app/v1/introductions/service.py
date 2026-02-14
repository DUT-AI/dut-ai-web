from app.core.base_service import BaseService
from .repository import IntroductionRepository
from .models import Introduction
from .schemas import IntroductionCreate, IntroductionUpdate


class IntroductionService(
    BaseService[Introduction, IntroductionCreate, IntroductionUpdate]
):

    def __init__(self, repo: IntroductionRepository):
        super().__init__(repo, entity_name="Introduction")
