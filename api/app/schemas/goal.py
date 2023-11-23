from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import List, Optional, Union
from .common import DBCommon
from .user import UserOut, UserDB


class TextBase(BaseModel):
    text: str


class GoalBase(TextBase):
    notes: Optional[str] = None
    archived: bool = False


class GoalIn(TextBase):
    pass


class TaskStatus(str, Enum):
    NOT_STARTED = 'not started'
    IN_PROGRESS = 'in progress'
    COMPLETED = 'completed'


class GoalTaskBase(BaseModel):
    status: str


class GoalTaskIn(TextBase):
    pass


class GoalTaskUpdate(GoalTaskBase):
    status: Optional[TaskStatus] = None


class GoalTaskOut(GoalTaskBase, DBCommon):
    goal_id: int
    text: str
    status: TaskStatus
    id: int


class GoalOut(GoalIn, DBCommon):
    id: int
    user_id: int
    user: UserOut
    tasks: List[GoalTaskOut]
    notes: Union[str, None]
    archived: bool = False


class GoalUpdate(BaseModel):
    text: Optional[str] = None
    notes: Optional[str] = None
    archived: Optional[bool] = None
