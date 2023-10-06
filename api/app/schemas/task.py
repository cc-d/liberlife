from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .common import DBCommon
from .user import UserOut, UserDB
from .task_updates import TaskUpdateOut, TaskUpdateDB


class TaskBase(BaseModel):
    text: str


class TaskIn(TaskBase):
    pass


class TaskOut(TaskIn, DBCommon):
    user_id: int
    updates: List['TaskUpdateOut'] = []


class TaskDB(TaskOut):
    user: UserDB

    class Config:
        orm_mode = True
