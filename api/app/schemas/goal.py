from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .common import DBCommon
from .user import UserOut, UserDB


class GoalBase(BaseModel):
    text: str


class GoalIn(GoalBase):
    pass


class GoalOut(GoalIn, DBCommon):
    id: int
    user_id: int
    user: UserOut


class GoalTaskBase(BaseModel):
    pass


class GoalTaskIn(GoalTaskBase):
    goal_id: int


class GoalTaskOut(GoalTaskIn, DBCommon):
    id: int
    completed: bool
    goal: GoalOut


class GoalTaskUpdate(GoalTaskBase):
    completed: bool
