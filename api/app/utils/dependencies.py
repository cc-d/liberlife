from jwt import PyJWTError
from fastapi import Depends, HTTPException
from .security import decode_jwt, oauth_scheme
from ..schemas import user as UserSchema
from ..db import get_adb, AsyncSession
from ..crud.user import get_user_from_username

from fastapi import Depends, HTTPException, Security
from pydantic import ValidationError


async def get_current_user(
    token: str = Depends(oauth_scheme), db: AsyncSession = Depends(get_adb)
) -> UserSchema.UserOut:
    try:
        # Decode the token. This function should check token's signature and expiration time.
        # If everything's good, it returns the user data. Otherwise, it raises an exception.
        payload = decode_jwt(token)
        user = payload.get("sub")
    except (PyJWTError, ValidationError):
        raise HTTPException(
            status_code=401, detail="Could not validate credentials"
        )

    user = await get_user_from_username(user, must_exist=True, db=db)

    return user
