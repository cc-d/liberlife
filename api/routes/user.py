from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

import api.config as config
from ..schemas import TokenData, UserDB, UserToken
from ..utils import encode_jwt, decode_jwt, hash_pass, verify_pass


urouter = APIRouter(prefix='/u', tags=['users'])


@urouter.post('/token', response_model=TokenData)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    usr_db = UserDB(
        username=form.username, hpassword=hash_pass(form.password)
    )  # Placeholder
    if not usr_db:
        raise HTTPException(
            status_code=400, detail="Incorrect username or password"
        )
    if not verify_pass(form.password, usr_db.hpassword):
        raise HTTPException(
            status_code=400, detail="Incorrect username or password"
        )

    token_exp = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = encode_jwt(data={"sub": usr_db.username}, expires=token_exp)

    return {"access_token": access_token, "token_type": "bearer"}
