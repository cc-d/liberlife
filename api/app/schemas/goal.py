from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class GoalBase(BaseModel):
    text: str
    user_id: int
    is_active: Optional[bool] = True


class GoalIn(GoalBase):
    pass


class GoalOut(GoalBase):
    id: int
    created_on: datetime
    updated_on: datetime


class GoalDB(GoalOut):
    class Config:
        from_attributes = True
