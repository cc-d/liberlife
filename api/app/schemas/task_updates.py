from pydantic import BaseModel
from datetime import datetime
from .common import DBCommon
from .user import UserOut, UserDB


class TaskUpdateBase(BaseModel):
    text: str
    task_id: int


class TaskUpdateIn(TaskUpdateBase):
    pass


class TaskUpdateOut(TaskUpdateIn, DBCommon):
    pass


class TaskUpdateDB(TaskUpdateOut):
    task: 'TaskDB'

    class Config:
        orm_mode = True
