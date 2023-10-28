import pytest
from sqlalchemy import select
from fastapi.testclient import TestClient
from api.app.main import app
from api.app.db.session import (
    SessionLocal,
    Base,
    AsyncSessionLocal,
    async_engine,
    sync_engine,
)
from api.app.db.common import async_addcomref
from api.app.db.models import User, Goal, GoalTask
from .. import common as _comm


class AuthenticatedTestClient(TestClient):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.token = self.obtain_token()
        self.headers.update({"Authorization": f"Bearer {self.token}"})

    def obtain_token(self):
        # Register the user first
        self.post("/u/register", json=_comm.LOGINJSON)
        # Then login
        response = super().post("/u/login", json=_comm.LOGINJSON)
        _comm.assert_token(response)
        return response.json()["access_token"]


@pytest.fixture(scope="module")
def adb():
    # Set up the database for testing
    Base.metadata.create_all(bind=async_engine)
    yield
    # Teardown - drop all tables
    Base.metadata.drop_all(bind=async_engine)


@pytest.mark.asyncio
async def test_get_user_goals(adb):
    u = adb.execute(select(User).where(User.username == _comm.USERNAME))
    print(u)
