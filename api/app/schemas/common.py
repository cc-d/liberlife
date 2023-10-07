from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DBCommon(BaseModel):
    id: int
    created_on: datetime
    updated_on: Optional[datetime] = None
