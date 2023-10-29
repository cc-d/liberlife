import pytest
from typing import Optional
from datetime import datetime as dt
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, Mock

from api.app.db.session import AsyncSessionLocal, SessionLocal
from api.app.schemas import user as SchemaUser, goal as SchemaGoal
from api.app.main import app
from api.app.utils.security import decode_jwt, hash_pass


client = TestClient(app)


USERNAME = "testuser"
PASSWORD = "testpass"
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

ADBMOCK = AsyncMock()


def assert_token(resp):
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    assert resp.json()["token_type"] == "bearer"
    _decoded = decode_jwt(resp.json()["access_token"])
    assert "sub" in _decoded
    assert _decoded["sub"] == LOGINJSON["username"]
    assert 'exp' in _decoded
