from pydantic import BaseModel
from datetime import datetime


class CommonBase(BaseModel):
    created_on: datetime
    updated_on: datetime


class IDCommon(BaseModel):
    id: int


class DBCommon(IDCommon, CommonBase):
    pass
