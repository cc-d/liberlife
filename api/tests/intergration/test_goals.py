import logging
import os
import asyncio
from contextlib import asynccontextmanager, contextmanager

import pytest

from app.db.models import Goal
from logfunc import logf
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker

from api.app.db.session import async_engine
from api.app.schemas import goal as SchemaGoal
from api.app.schemas import user as SchemaUser
from ..common import (
    GOALS,
    HPASSWORD,
    LOGINJSON,
    OAUTH_LOGIN_FORM,
    PASSWORD,
    TASKS,
    USERDB,
    USERNAME,
    assert_token,
    client,
    create_db,
    event_loop,
    headers,
    loginresp,
    reguser,
    user_and_headers,
    userme,
)
from .test_user import test_register


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

            newgoals.append(ng)

        return newgoals, headers, tuser

    return event_loop.run_until_complete(_async_setup())


@pytest.mark.asyncio
async def test_list_goals(client, setup_goals):
    """also tests goal create"""
    newgoals, headers, _ = setup_goals
    resp = await client.get("/goals", headers=headers)
    assert resp.status_code == 200
    goals_from_response = resp.json()
    print(goals_from_response)  # Print the list of goals
    assert len(goals_from_response) == len(newgoals)


@pytest.mark.asyncio
async def test_get_goal(client, setup_goals):
    newgoals, headers, _ = setup_goals
    for goal in newgoals:
        resp = await client.get(f"/goals/{goal['id']}", headers=headers)
        assert resp.status_code == 200
        assert resp.json()['text'] == goal['text']


@pytest.mark.asyncio
async def test_update_goal(client, setup_goals):
    newgoals, headers, _ = setup_goals
    resp = await client.put(
        f"/goals/{newgoals[1]['id']}", json={'text': 'UPDATED'}, headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()['text'] == 'UPDATED'
    assert resp.json()['id'] == newgoals[1]['id']


async def allgoals_request(client, headers):
    resp = await client.get("/goals", headers=headers)
    return resp


@pytest.mark.asyncio
async def test_delete_goal(client, setup_goals):
    newgoals, headers, tuser = setup_goals
    ugtext = 'UNIQUE GOAL TEXT !!!!!!'

    newgoal = await new_goalresp(ugtext, client, headers)
    assert newgoal['text'] == ugtext
    assert newgoal['user_id'] == tuser['id']
    ngid = newgoal['id']

    resp = await client.delete(f"/goals/{ngid}", headers=headers)
    assert resp.status_code == 200

    agresp = await allgoals_request(client, headers)
    agjson = agresp.json()
    ags = {ag['id']: ag['text'] for ag in agjson}

    assert ngid not in ags.keys()
    assert newgoal['text'] not in ags.values()
    assert len(agjson) == len(newgoals)


@pytest.fixture(scope="module")
def setup_tasks(client, setup_goals, event_loop):
    async def _async_setup():
        tuser, headers, _ = setup_goals
        newgoals = setup_goals[0]

        for goal in newgoals:
            for text in TASKS.TEXTS:
                await new_taskresp(text, goal['id'], client, headers)
        return newgoals, headers, _

    return event_loop.run_until_complete(_async_setup())


@pytest.mark.asyncio
async def test_create_task(client, setup_tasks):
    newgoals, headers, _ = setup_tasks

    for goal in newgoals:
        resp = await client.get(f"/goals/{goal['id']}", headers=headers)
        assert resp.status_code == 200
        assert len(resp.json()['tasks']) == len(TASKS.TEXTS)


@pytest.mark.asyncio
async def test_get_task(client, setup_tasks):
    newgoals, headers, _ = setup_tasks

    for goal in newgoals:
        for task in goal['tasks']:
            resp = await client.get(
                f"/goals/{goal['id']}/tasks/{task['id']}", headers=headers
            )
            assert resp.status_code == 200
            assert resp.json()['text'] == task['text']


@pytest.mark.asyncio
async def test_update_task(client, setup_tasks):
    newgoals, headers, _ = setup_tasks

    original = {}

    for goal in newgoals:
        for task in goal['tasks']:
            original[task['id']] = task
            resp = await client.put(
                f"/goals/{goal['id']}/tasks/{task['id']}",
                json={'text': 'UPDATED'},
                headers=headers,
            )
            assert resp.status_code == 200
            assert resp.json()['text'] == 'UPDATED'
            assert resp.json()['id'] == task['id']

    # now change them back incase same session
    for goal in newgoals:
        for task in goal['tasks']:
            resp = await client.put(
                f"/goals/{goal['id']}/tasks/{task['id']}",
                json={
                    'text': original[task['id']]['text'],
                    'completed': original[task['id']]['completed'],
                },
                headers=headers,
            )
            assert resp.status_code == 200
            assert resp.json()['text'] == original[task['id']]['text']
            assert resp.json()['id'] == task['id']


@pytest.mark.asyncio
async def test_delete_task(client, setup_tasks):
    newgoals, headers, _ = setup_tasks
    uttext = 'UNIQUE TASK TEXT !!!!!!'
    newtask = await new_taskresp(uttext, newgoals[0]['id'], client, headers)
    assert newtask['text'] == uttext
    assert newtask['goal_id'] == newgoals[0]['id']
    utid = newtask['id']

    resp = await client.delete(
        f"/goals/{newgoals[0]['id']}/tasks/{utid}", headers=headers
    )
    assert resp.status_code == 200

    resp = await client.get(f"/goals/{newgoals[0]['id']}", headers=headers)
    assert resp.status_code == 200
    gtasks = resp.json()['tasks']

    assert utid not in [t['id'] for t in gtasks]
    assert uttext not in [t['text'] for t in gtasks]
