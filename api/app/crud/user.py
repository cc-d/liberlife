from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from logfunc import logf
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from typing import Optional, Union
from ..db import get_adb
from ..db.models import User
from ..schemas import user as SchUser

from ..utils.security import decode_jwt, oauth_scheme


async def get_user_from_username(
    username: str,
    must_exist: Optional[bool] = None,
    db: AsyncSession = Depends(get_adb),
) -> SchUser.UserDB:
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


async def get_user_from_id(
    user_id: int, db: AsyncSession = Depends(get_adb)
) -> Optional[User]:
    user = await db.execute(select(User).where(User.id == user_id))
    user = user.scalar_one_or_none()
    return user
