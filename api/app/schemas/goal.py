from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .common import DBCommon
from .user import UserOut, UserDB


class GoalBase(BaseModel):
    text: str


class GoalIn(GoalBase):
    pass


class GoalTaskBase(BaseModel):
    completed: bool


class GoalTaskIn(GoalBase):
    completed: bool = False
    text: str


class GoalTaskUpdate(GoalTaskBase):
    pass


class GoalTaskOut(GoalTaskBase, DBCommon):
    goal_id: int
    id: int
    text: str


class GoalOut(GoalIn, DBCommon):
    user_id: int
    user: UserOut
    tasks: List[GoalTaskOut] = []
    notes: Optional[str] = None


class GoalUpdateNotes(BaseModel):
    notes: Optional[str] = None
