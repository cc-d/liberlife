from typing import Optional, Union
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from logfunc import logf
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..schemas import user as SchemaUser
from ..db import get_adb
from ..db.models import User
from ..db.common import async_addcomref
from ..crud import user as CrudUser
from ..utils.dependencies import get_current_user
from ..utils.security import verify_pass, hash_pass, encode_jwt
from ..utils.httperrors import HTTP401, HTTP404, HTTP400, HTTP409

router = APIRouter(prefix='/u', tags=['user'])


@router.post("/register", response_model=SchemaUser.Token)
async def register(
    data: SchemaUser.UserIn, db: AsyncSession = Depends(get_adb)
):
    existing_user = await CrudUser.get_from_username(
        data.username, must_exist=False, db=db
    )
    if existing_user:
        raise HTTP409(detail="User already exists")
    hpass = hash_pass(data.password)
    new_user = User(username=data.username, hpassword=hpass)

    await async_addcomref(db, new_user)

    access_token = encode_jwt(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/oauth_login", response_model=SchemaUser.Token)
async def oauth_login(
    data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_adb),
):
    return await CrudUser.get_token_from_login(
        data.username, data.password, db=db
    )


@router.post("/login", response_model=SchemaUser.Token)
async def json_login(
    data: SchemaUser.UserIn, db: AsyncSession = Depends(get_adb)
):
    return await CrudUser.get_token_from_login(
        data.username, data.password, db=db
    )


@router.get("/me", response_model=SchemaUser.UserOut)
async def me(cur_user=Depends(get_current_user)):
    if not cur_user:
        raise HTTPException(status_code=404, detail="User not found")
    return cur_user
