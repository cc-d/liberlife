import jwt
from jwt.exceptions import PyJWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

import config
import schemas
import utils


oauth_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token: str = Depends(oauth_scheme)):
    cred_err = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = utils.decode_jwt(token)
        user_name: str = payload.get("sub")
        if not user_name:
            raise cred_err
        token_data = schemas.UserToken(username=user_name)
    except PyJWTError:
        raise cred_err
    usr = User(username=token_data.username)  # Placeholder
    if not usr:
        raise cred_err
    return usr
