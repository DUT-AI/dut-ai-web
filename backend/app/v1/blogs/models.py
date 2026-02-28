from sqlalchemy import Column, Integer, String, Text, DateTime, Index, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import TSVECTOR
from app.core.database import Base
from app.core.mixins import HasImageUpload
import datetime

# Bảng trung gian cho quan hệ n-n giữa Blog và User
blog_authors = Table(
    "blog_authors",
    Base.metadata,
    Column("blog_id", Integer, ForeignKey("blogs.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

# Bảng trung gian cho quan hệ n-n giữa Blog và Keyword
blog_keywords = Table(
    "blog_keywords",
    Base.metadata,
    Column("blog_id", Integer, ForeignKey("blogs.id"), primary_key=True),
    Column("keyword_id", Integer, ForeignKey("keywords.id"), primary_key=True),
)

# Để SQLAlchemy tìm thấy User class
from app.v1.users.models import User


class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(Integer, primary_key=True, index=True)
    keyword_name = Column(String(255), unique=True, index=True, nullable=False)
    number_blog_contain = Column(Integer, default=0)

    def __str__(self):
        return self.keyword_name


class Blog(Base, HasImageUpload):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    authors_rel = relationship("User", secondary=blog_authors, backref="blogs")
    views = Column(Integer, default=0)
    keywords_rel = relationship("Keyword", secondary=blog_keywords, backref="blogs")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )
    image_url = Column(String(1000), nullable=True)
    search_vector = Column(TSVECTOR)

    __table_args__ = (
        Index("ix_blogs_search_vector", "search_vector", postgresql_using="gin"),
    )

    def __str__(self):
        return self.title
