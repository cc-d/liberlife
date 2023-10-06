from jwt.exceptions import PyJWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status, Depends, Request
from ..db.models import User
from ..schemas import user as SchUser
from ..crud.user import get_user_from_username
from ..utils.security import oauth_scheme, decode_jwt


async def get_current_user(request: Request) -> SchUser.UserDB:
    token = request.headers.get("Authorization")
    if token and "Bearer" in token:
        token = token.split(" ")[1]

    payload = decode_jwt(token)
    username = payload.get("sub")

    if username is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No username in sub field of jwt",
        )

    user = await get_user_from_username(username, must_exist=True)
    return user
