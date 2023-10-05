from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from .session import Base  # Adjust the import based on your folder structure


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    hpassword: Mapped[str] = mapped_column(String(100))
