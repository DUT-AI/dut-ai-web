from sqlalchemy import Column, Integer, String
from app.core.database import Base


class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(Integer, primary_key=True, index=True)
    keyword_name = Column(String(255), unique=True, index=True, nullable=False)
    number_blog_contain = Column(Integer, default=0)

    def __str__(self):
        return self.keyword_name
