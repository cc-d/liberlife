from datetime import datetime
from pydantic import BaseModel
from typing import Optional

from .common import DBCommon


class UserBase(BaseModel):
    username: str


class UserIn(UserBase):
    password: str


class UserOut(UserBase, DBCommon):
    pass


class UserDB(UserOut):
    hpassword: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
