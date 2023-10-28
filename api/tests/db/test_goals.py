import pytest
from sqlalchemy import select
from sqlalchemy.orm import selectinload
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
def create_db():
    # Set up the database for testing
    Base.metadata.create_all(bind=sync_engine)
    yield
    # Teardown - drop all tables
    Base.metadata.drop_all(bind=sync_engine)


@pytest.fixture(scope="function")
async def get_adb():
    async with AsyncSessionLocal() as adb:
        yield adb


# not actually testing anything yet just getting it to work w/ async
@pytest.mark.asyncio
async def test_get_user_goals(create_db, get_adb):
    async with AsyncSessionLocal() as adb:
        # Create a user
        user = User(username=_comm.USERNAME, hpassword=_comm.HPASSWORD)
        await async_addcomref(adb, user)
        # Create a goal
        goal = Goal(text='Goal1', user_id=user.id)
        await async_addcomref(adb, goal)
        # Create a task
        task = GoalTask(text='Task1', goal_id=goal.id)
        await async_addcomref(adb, task)

        # Get the user's goals
        goals = await adb.execute(
            select(Goal)
            .where(Goal.user_id == user.id)
            .options(selectinload(Goal.tasks))
        )
        goals = goals.unique().scalars().all()
        assert len(goals) == 1
