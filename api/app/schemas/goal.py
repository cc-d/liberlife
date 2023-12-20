from pydantic import BaseModel, ConfigDict
from datetime import datetime
from enum import Enum
from typing import List, Optional, Union
from .common import DBCommon, IDCommon
from .user import UserOut, UserDB


class TextBase(BaseModel):
    text: str


class TemplateTaskDB(TextBase, IDCommon):
    template_id: int


class TemplateTaskIn(TextBase):
    pass


class TemplateTaskUpdate(TextBase):
    id: Optional[int] = None
    template_id: Optional[int] = None


class GoalTemplateDB(TextBase, IDCommon):
    user_id: int
    tasks: List[TemplateTaskDB]
    notes: Optional[str] = None
    use_todays_date: bool


class GoalTemplateIn(BaseModel):
    text: str
    notes: Optional[str] = None
    tasks: Optional[List[TemplateTaskIn]] = None
    use_todays_date: Optional[bool] = None


class GoalTemplateUpdate(BaseModel):
    text: Optional[str] = None
    notes: Optional[str] = None
    tasks: Optional[List[TemplateTaskUpdate]] = None
    use_todays_date: Optional[bool] = None


class GoalBase(TextBase):
    notes: Optional[str] = None
    archived: bool = False


class GoalIn(TextBase):
    template_id: Optional[int] = None


class TaskStatus(str, Enum):
    NOT_STARTED = 'not started'
    IN_PROGRESS = 'in progress'
    COMPLETED = 'completed'


class GoalTaskBase(BaseModel):
    status: TaskStatus


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
    tasks_locked: bool = False


class GoalUpdate(BaseModel):
    text: Optional[str] = None
    notes: Optional[str] = None
    archived: Optional[bool] = None
    tasks_locked: Optional[bool] = None
