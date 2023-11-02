from contextlib import asynccontextmanager, contextmanager

import pytest
from app.db.models import Goal
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker

from api.app.db.session import async_engine
from api.app.schemas import goal as SchemaGoal
from api.app.schemas import user as SchemaUser

from ..common import (
    TASKS,
    GOALS,
    HPASSWORD,
    LOGINJSON,
    OAUTH_LOGIN_FORM,
    PASSWORD,
    USERDB,
    USERNAME,
    assert_token,
    client,
    create_db,
    event_loop,
    funcsession,
    headers,
    loginresp,
    reguser,
    user_and_headers,
    userme,
)
from .test_user import test_register
from logfunc import logf


@logf(level='INFO')
async def new_goalresp(text, client, headers, **kwargs):
    resp = await client.post("/goals", json={'text': text}, headers=headers)
    return resp.json()


@logf(level='INFO')
async def new_taskresp(text, goalid, client, headers, **kwargs):
    resp = await client.post(
        "/goals/%s/tasks" % goalid,
        json={'text': text, 'completed': False},
        headers=headers,
    )
    return resp.json()


@pytest.fixture(scope="module")
def setup_goals(client, user_and_headers, event_loop):
    async def _async_setup():
        tuser, headers = user_and_headers
        newgoals = []
        for text in GOALS.TEXTS:
            ng = await new_goalresp(text, client, headers)
            print(ng, '@@@@@@@')

            for ttext in TASKS.TEXTS:
                nt = await new_taskresp(
                    ttext, goalid=ng['id'], client=client, headers=headers
                )
                ng['tasks'].append(nt)
            newgoals.append(ng)

        return newgoals, headers, tuser

    return event_loop.run_until_complete(_async_setup())


@pytest.mark.asyncio
async def test_list_goals(client, setup_goals):
    """also tests goal create"""
    newgoals, headers, tuser = setup_goals
    resp = await client.get("/goals", headers=headers)
    assert resp.status_code == 200
    goals_from_response = resp.json()
    print(goals_from_response)  # Print the list of goals
    assert len(goals_from_response) == len(newgoals)


@pytest.mark.asyncio
async def test_get_goal(client, setup_goals):
    newgoals, headers, tuser = setup_goals
    for goal in newgoals:
        resp = await client.get(f"/goals/{goal['id']}", headers=headers)
        assert resp.status_code == 200
        assert resp.json()['text'] == goal['text']


@pytest.mark.asyncio
async def test_update_goal(client, setup_goals):
    newgoals, headers, tuser = setup_goals
    resp = await client.put(
        f"/goals/{newgoals[1]['id']}", json={'text': 'UPDATED'}, headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()['text'] == 'UPDATED'
    assert resp.json()['id'] == newgoals[1]['id']


@pytest.mark.asyncio
async def test_delete_goal(client, setup_goals):
    newgoals, headers, tuser = setup_goals

    # Create a new session within the test function
    session = sessionmaker(
        async_engine, class_=AsyncSession, expire_on_commit=False
    )()

    try:
        async with session.begin():
            for goal in newgoals:
                resp = await client.delete(
                    f"/goals/{goal['id']}", headers=headers
                )

            stmt = select(Goal).where(Goal.user_id == tuser['id'])
            result = await session.execute(stmt)
            goals = result.scalars().all()
            assert len(goals) == 0

    finally:
        session.close()  # Ensure the session is properly closed


# verify that the goal is not deleted from the database
@pytest.mark.asyncio
async def test_delete_goal_db(client, setup_goals):
    newgoals, headers, tuser = setup_goals
    resp = await client.get("/goals", headers=headers)
    rjson = resp.json()
