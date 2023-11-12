from datetime import datetime, timedelta
import bcrypt
import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from logfunc import logf
from pydantic import BaseModel
from .. import config


@logf(log_args=False)
def verify_pass(plain_pass, hashed_pass):
    return bcrypt.checkpw(plain_pass.encode(), hashed_pass.encode())


@logf(log_args=False)
def hash_pass(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


@logf()
def encode_jwt(data: dict, expires: timedelta = None):
    payload = data.copy()
    if expires:
        expiry = datetime.utcnow() + expires
    else:
        expiry = datetime.utcnow() + timedelta(seconds=config.JWT_EXPIRE_SECS)
    payload.update({"exp": expiry})
    return jwt.encode(payload, config.JWT_KEY, algorithm=config.JWT_ALGO)


@logf()
def decode_jwt(token: str):
    return jwt.decode(token, config.JWT_KEY, algorithms=[config.JWT_ALGO])


oauth_scheme = OAuth2PasswordBearer(tokenUrl="u/oauth_login")


@logf()
def obj_userid_401(uid: int, obj: any) -> bool:
    """Raise 401 if obj doesnt have matching user id
    Raises:
        HTTPException: 401 if obj doesnt have matching user id
    Returns:
        bool: True if obj has matching user id otherwise should err
    """
    if isinstance(obj, dict):
        if 'user_id' in obj and obj['user_id'] == uid:
            return True
    elif uid == getattr(obj, 'user_id'):
        return True

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="You are not authorized to access this resource.",
    )
