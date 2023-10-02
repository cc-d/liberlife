from pydantic import BaseModel


class User(BaseModel):
    username: str


class UserDB(User):
    hpassword: str


class TokenData(BaseModel):
    access_token: str
    token_type: str


class UserToken(BaseModel):
    username: str
