from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from logfunc import logf
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from typing import Optional, Union
from ..db import get_adb
from ..db.models import User
from ..schemas import user as SchemaUser
from ..utils.httperrors import HTTP401, HTTP404, HTTP400, HTTP409
from ..utils.security import decode_jwt, oauth_scheme, verify_pass, encode_jwt


async def get_from_username(
    username: str,
    must_exist: Optional[bool] = None,
    db: AsyncSession = Depends(get_adb),
) -> SchemaUser.UserDB:
    """Get a user from the database by username.

    ('test', must_exist=True) -> UserDB(username='test', ...)
    """
    user = await db.execute(select(User).where(User.username == username))
    user = user.scalar_one_or_none()

    if must_exist is not None:
        if must_exist and user is None:
            raise HTTP404
        elif not must_exist and user is not None:
            raise HTTP409(detail="User already exists")

    return user


async def get_token_from_login(
    username: str, password: str, db: AsyncSession = Depends(get_adb)
) -> SchemaUser.Token:
    """Get a token from a username and password.

    ('test', 'test') -> {'access_token': '...', 'token_type': 'bearer'}
    """
    user = await get_from_username(username, must_exist=True, db=db)
    if not verify_pass(password, user.hpassword):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    new_token = encode_jwt(data={"sub": user.username})
    return {"access_token": new_token, "token_type": "bearer"}


async def get_from_id(
    user_id: int, db: AsyncSession = Depends(get_adb)
) -> Optional[User]:
    user = await db.execute(select(User).where(User.id == user_id))
    user = user.scalar_one_or_none()
    return user
