from pydantic import BaseModel
from datetime import datetime


class DBCommon(BaseModel):
    id: int
    created_on: str
    updated_on: str
