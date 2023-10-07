from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from .session import Base

_STRLEN = 255


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    username: Mapped[str] = mapped_column(
        String(_STRLEN), unique=True, index=True
    )
    hpassword: Mapped[str] = mapped_column(String(_STRLEN))
    created_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    goals = relationship("Goal", back_populates="user")


class Goal(Base):
    __tablename__ = 'goals'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )
    text: Mapped[str] = mapped_column(Text)

    created_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    user = relationship("User", back_populates="goals")
    tasks = relationship(
        "GoalTask", back_populates="goal", cascade="all, delete-orphan"
    )


class GoalTask(Base):
    __tablename__ = 'goal_tasks'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    goal_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('goals.id'), nullable=False
    )
    text: Mapped[str] = mapped_column(Text, nullable=False, default='new task')
    completed: Mapped[bool] = mapped_column(Boolean, default=False)

    created_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    goal = relationship("Goal", back_populates="tasks")
