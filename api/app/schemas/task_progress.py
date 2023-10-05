from pydantic import BaseModel
from datetime import datetime


class TaskProgressBase(BaseModel):
    task_id: int
    status_update: str


class TaskProgressIn(TaskProgressBase):
    pass


class TaskProgressOut(TaskProgressBase):
    id: int
    timestamp: datetime


class TaskProgressDB(TaskProgressOut):
    class Config:
        from_attributes = True
