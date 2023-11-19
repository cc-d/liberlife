from datetime import datetime as dt
from api.app.schemas import user as SchemaUser
from api.app.utils.security import decode_jwt, hash_pass

USERNAME = "testuser2"
PASSWORD = "testpass2"
USERID = 1
HPASSWORD = hash_pass(PASSWORD)

LOGINJSON = {"username": USERNAME, "password": PASSWORD}

USERDB = SchemaUser.UserDB(
    id=USERID,
    username=USERNAME,
    hpassword=HPASSWORD,
    created_on=dt.utcnow(),
    updated_on=dt.utcnow(),
)

OAUTH_LOGIN_FORM = {
    "grant_type": "password",
    "username": USERNAME,
    "password": PASSWORD,
}
