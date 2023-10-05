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


class Goal(Base):
    __tablename__ = 'goals'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    text: Mapped[str] = mapped_column(Text)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    tasks = relationship("Task", back_populates="goal")


class Task(Base):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    text: Mapped[str] = mapped_column(Text)
    goal_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('goals.id'), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    goal = relationship("Goal", back_populates="tasks")
    progress = relationship("TaskProgress", back_populates="task")


class TaskProgress(Base):
    __tablename__ = 'task_progress'

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )
    task_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('tasks.id'), nullable=False
    )
    status_update: Mapped[str] = mapped_column(Text, nullable=False)
    timestamp: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    task = relationship("Task", back_populates="progress")
