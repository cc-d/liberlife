from pydantic import BaseModel, validator
from .goal import (
    GoalIn,
    GoalOut,
    GoalTaskIn,
    GoalTaskOut,
    GoalUpdate,
    TaskStatus,
)
from .common import CommonBase
from .user import UserOut


class SnapshotTaskOut(GoalTaskOut):
    status: str


class SnapshotGoalOut(CommonBase):
    id: int
    user_id: int
    tasks: list[SnapshotTaskOut] = []
    notes: str | None
    archived: bool = False
    board_id: str
    text: str
    tasks_locked: bool = False


class SnapshotOut(CommonBase):
    uuid: str
    user_id: int
    goals: list[SnapshotGoalOut]


class SnapshotDelete(BaseModel):
    uuid: str
