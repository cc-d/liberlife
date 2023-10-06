from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    username: str


class UserIn(UserBase):
    password: str


class UserOut(UserBase):
    id: int


class UserDB(UserOut):
    hpassword: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class UserToken(BaseModel):
    username: str
