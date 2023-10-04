from sqlalchemy import Integer, String, Column
from sqlalchemy.orm import declarative_base, Mapped

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = Column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    username: Mapped[str] = Column(String(50), unique=True, index=True)
    hpassword: Mapped[str] = Column(String(100))
