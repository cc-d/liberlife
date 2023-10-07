from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .common import DBCommon
from .user import UserOut, UserDB


class GoalBase(BaseModel):
    text: str


class GoalIn(GoalBase):
    pass


class GoalTaskIn(BaseModel):
    text: str = 'new task'


class GoalTaskOut(GoalTaskIn, DBCommon):
    goal_id: int
    id: int
    completed: bool


class GoalOut(GoalIn, DBCommon):
    user_id: int
    user: UserOut
    tasks: List[GoalTaskOut] = []


class GoalTaskUpdate(BaseModel):
    text: Optional[str] = 'text'
    completed: Optional[bool] = False
