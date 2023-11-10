from pydantic import BaseModel
from datetime import datetime


class DBCommon(BaseModel):
    id: int
    created_on: datetime
    updated_on: datetime
