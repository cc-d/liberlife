from datetime import datetime, timedelta
import bcrypt
import jwt
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from .. import config


def verify_pass(plain_pass, hashed_pass):
    return bcrypt.checkpw(plain_pass.encode(), hashed_pass.encode())


def hash_pass(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def encode_jwt(data: dict, expires: timedelta = None):
    payload = data.copy()
    if expires:
        expiry = datetime.utcnow() + expires
    else:
        expiry = datetime.utcnow() + timedelta(seconds=config.JWT_EXPIRE_SECS)
    payload.update({"exp": expiry})
    return jwt.encode(payload, config.JWT_KEY, algorithm=config.JWT_ALGO)


def decode_jwt(token: str):
    return jwt.decode(token, config.JWT_KEY, algorithms=[config.JWT_ALGO])


oauth_scheme = OAuth2PasswordBearer(tokenUrl="u/token")
