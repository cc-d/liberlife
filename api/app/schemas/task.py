from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .task_progress import TaskProgressOut


class TaskBase(BaseModel):
    text: str
    goal_id: int
    is_active: Optional[bool] = True


class TaskIn(TaskBase):
    pass


class TaskOut(TaskBase):
    id: int
    created_on: datetime
    updated_on: datetime
    progress: List[TaskProgressOut]


class TaskDB(TaskOut):
    class Config:
        from_attributes = True
