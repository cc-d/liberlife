from pydantic import BaseModel
from datetime import datetime


class CommonBase(BaseModel):
    created_on: datetime
    updated_on: datetime


class DBCommon(CommonBase):
    id: int
