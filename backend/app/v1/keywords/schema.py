from pydantic import BaseModel


class KeywordBase(BaseModel):
    keyword_name: str


class KeywordCreate(KeywordBase):
    pass


class KeywordUpdate(KeywordBase):
    pass


class KeywordResponse(KeywordBase):
    id: int
    number_blog_contain: int

    class Config:
        from_attributes = True
