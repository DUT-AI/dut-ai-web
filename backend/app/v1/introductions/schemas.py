from pydantic import BaseModel


class IntroductionBase(BaseModel):
    content: str


class IntroductionCreate(IntroductionBase):
    pass


class IntroductionUpdate(IntroductionBase):
    pass


class IntroductionResponse(IntroductionBase):
    id: int

    model_config = {"from_attributes": True}
