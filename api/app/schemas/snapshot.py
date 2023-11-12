from .goal import GoalIn, GoalOut, GoalTaskIn, GoalTaskOut, GoalUpdate
from .common import CommonBase
from .user import UserOut


class SnapshotTaskOut(GoalTaskOut):
    pass


class SnapshotGoalOut(CommonBase):
    id: int
    user_id: int
    tasks: list[SnapshotTaskOut] = []
    notes: str | None
    archived: bool = False
    board_id: str


class SnapshotOut(CommonBase):
    uuid: str
    user_id: int
    goals: list[SnapshotGoalOut]
