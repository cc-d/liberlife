from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..schemas import user as UserSchema
from ..db import get_adb
from ..db.models import User
from ..db.common import async_commit_refresh
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
    existing_user = await db.execute(
        select(User).where(User.username == data.username)
    )
    if existing_user.scalar() is not None:
        raise HTTPException(
            status_code=400, detail="Username already registered"
        )

    hashed_password = hash_pass(data.password)
    new_user = User(username=data.username, hpassword=hashed_password)

    db.add(new_user)
    await async_commit_refresh(db, new_user)

    return new_user


@router.post("/login", response_model=UserSchema.Token)
async def login(data: UserSchema.UserIn, db: AsyncSession = Depends(get_adb)):
    user = await db.execute(select(User).where(User.username == data.username))
    user = user.scalar()
    if not user or not verify_pass(data.password, user.hpassword):
        raise HTTPException(
            status_code=400, detail="Incorrect username or password"
        )

    access_token = encode_jwt(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserSchema.UserBase)
async def me(
    token: str = Depends(oauth_scheme), db: AsyncSession = Depends(get_adb)
):
    user_data = decode_jwt(token)
    user = await db.execute(
        select(User).where(User.username == user_data["sub"])
    )
    user = user.scalar()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    return user
