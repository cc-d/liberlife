from typing import Optional, Union
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from logfunc import logf
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..schemas import user as UserSchema
from ..db import get_adb
from ..db.models import User
from ..db.common import async_addcomref
from ..crud.user import get_user_from_username
from ..utils.dependencies import get_current_user
from ..utils.security import (
    verify_pass,
    hash_pass,
    encode_jwt,
    decode_jwt,
    oauth_scheme,
)


router = APIRouter(prefix='/u', tags=['user'])


@router.post("/register", response_model=UserSchema.UserOut)
async def register(
    data: UserSchema.UserIn, db: AsyncSession = Depends(get_adb)
):
    hpass = hash_pass(data.password)
    new_user = User(username=data.username, hpassword=hpass)

    await async_addcomref(db, new_user)

    return new_user


@router.post("/oauth_login", response_model=UserSchema.Token)
async def oauth_login(
    data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_adb),
):
    user = await get_user_from_username(data.username, must_exist=True, db=db)

    if not verify_pass(data.password, user.hpassword):
        raise HTTPException(
            status_code=400, detail="Incorrect username or password"
        )

    access_token = encode_jwt(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=UserSchema.Token)
async def json_login(
    data: UserSchema.UserIn, db: AsyncSession = Depends(get_adb)
):
    user = await get_user_from_username(data.username, must_exist=True, db=db)

    if not verify_pass(data.password, user.hpassword):
        raise HTTPException(status_code=400, detail="incorrect password")

    access_token = encode_jwt(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserSchema.UserOut)
async def me(cur_user=Depends(get_current_user)):
    if not cur_user:
        raise HTTPException(status_code=400, detail="User not found")

    return cur_user
