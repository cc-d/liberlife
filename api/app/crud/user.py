from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from logfunc import logf
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from typing import Optional, Union
from ..db import get_adb
from ..db.models import User
from ..schemas import user as SchemaUser

from ..utils.security import decode_jwt, oauth_scheme, verify_pass, encode_jwt


async def get_from_username(
    username: str,
    must_exist: Optional[bool] = None,
    db: AsyncSession = Depends(get_adb),
) -> SchemaUser.UserDB:
    user = await db.execute(select(User).where(User.username == username))
    user = user.scalar_one_or_none()

    if must_exist is not None:
        if must_exist and user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with username {username} not found",
            )
        elif not must_exist and user is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with username {username} already exists",
            )
    return user


async def get_token_from_login(
    username: str, password: str, db: AsyncSession = Depends(get_adb)
) -> SchemaUser.Token:
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
