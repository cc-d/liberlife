from uuid import uuid4
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from .session import Base

_STRLEN = 255


class TimestampMixin(Base):
    __abstract__ = True
    created_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_on: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class CommonBase(TimestampMixin):
    __abstract__ = True
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True, autoincrement=True
    )


class User(CommonBase):
    __tablename__ = 'users'

    username: Mapped[str] = mapped_column(
        String(_STRLEN), unique=True, index=True
    )
    hpassword: Mapped[str] = mapped_column(String(_STRLEN))

    goals = relationship("Goal", back_populates="user")
    board_snapshots = relationship(
        "BoardSnapshot", back_populates="user", cascade="all, delete-orphan"
    )


class CommonGoal(CommonBase):
    __abstract__ = True
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )
    text: Mapped[str] = mapped_column(Text)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    archived: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )


class Goal(CommonGoal):
    __tablename__ = 'goals'
    user = relationship("User", back_populates="goals")
    tasks = relationship(
        "GoalTask",
        back_populates="goal",
        cascade="all, delete-orphan",
        lazy='joined',
    )


class SnapshotGoal(CommonGoal):
    __tablename__ = 'snapshot_goals'
    tasks = relationship(
        "SnapshotGoalTask",
        back_populates="goal",
        cascade="all, delete-orphan",
        lazy='joined',
    )
    board_id: Mapped[str] = mapped_column(
        String, ForeignKey('board_snapshots.uuid'), nullable=False
    )
    board = relationship("BoardSnapshot", back_populates="goals")


class CommonGoalTask(CommonBase):
    __abstract__ = True
    text: Mapped[str] = mapped_column(Text, nullable=False, default='new task')
    completed: Mapped[bool] = mapped_column(Boolean, default=False)


class GoalTask(CommonGoalTask):
    __tablename__ = 'goal_tasks'
    goal_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('goals.id'), nullable=False
    )
    goal = relationship("Goal", back_populates="tasks")


class SnapshotGoalTask(CommonGoalTask):
    __tablename__ = 'snapshot_tasks'
    goal_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('snapshot_goals.id'), nullable=False
    )
    goal = relationship("SnapshotGoal", back_populates="tasks")


class BoardSnapshot(TimestampMixin):
    __tablename__ = 'board_snapshots'
    uuid: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )
    user = relationship("User", back_populates="board_snapshots")
    goals = relationship(
        "SnapshotGoal",
        back_populates="board",
        cascade="all, delete-orphan",
        lazy='joined',
    )
