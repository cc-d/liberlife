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
    status: TaskStatus

    @validator('status', pre=True, always=True)
    def convert_status(cls, v):
        if isinstance(v, str):
            return TaskStatus(v)
        return v


class SnapshotGoalOut(CommonBase):
    id: int
    user_id: int
    tasks: list[SnapshotTaskOut] = []
    notes: str | None
    archived: bool = False
    board_id: str
    text: str


class SnapshotOut(CommonBase):
    uuid: str
    user_id: int
    goals: list[SnapshotGoalOut]


class SnapshotDelete(BaseModel):
    uuid: str
