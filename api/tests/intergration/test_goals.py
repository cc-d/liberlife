import pytest
from ..common import (
    USERDB,
    LOGINJSON,
    assert_token,
    USERNAME,
    PASSWORD,
    HPASSWORD,
    event_loop,
    client,
    OAUTH_LOGIN_FORM,
    GOALS,
    headers,
    reguser,
    create_db,
    loginheaders,
    userme,
    user_and_headers,
)
from .test_user import test_register


@pytest.fixture(scope="module")
def setup_goals(client, create_db, user_and_headers, event_loop):
    async def _async_setup():
        ujson, loginheaders = user_and_headers
        newgoals = []

        for text in GOALS.TEXTS:
            resp = await client.post(
                "/goals",
                json={'text': text, 'user_id': ujson['id']},
                headers=loginheaders,
            )
            assert resp.status_code == 200
            newgoals.append(resp.json())
        return newgoals, loginheaders, ujson

    return event_loop.run_until_complete(_async_setup())


@pytest.mark.asyncio
async def test_list_goals(client, setup_goals):
    """also tests goal create"""
    newgoals, headers, ujson = setup_goals
    resp = await client.get("/goals", headers=headers)
    assert resp.status_code == 200
    goals_from_response = resp.json()
    print(goals_from_response)  # Print the list of goals
    assert len(goals_from_response) == len(newgoals)


@pytest.mark.asyncio
async def test_get_goal(client, setup_goals):
    newgoals, headers, ujson = setup_goals
    resp = await client.get(f"/goals/{newgoals[0]['id']}", headers=headers)
    assert resp.status_code == 200
    assert resp.json() == newgoals[0]


@pytest.mark.asyncio
async def test_update_goal(client, setup_goals):
    newgoals, headers, ujson = setup_goals
    resp = await client.put(
        f"/goals/{newgoals[0]['id']}", json={'text': 'UPDATED'}, headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()['text'] == 'UPDATED'


@pytest.mark.asyncio
async def test_delete_goal(client, setup_goals):
    newgoals, headers, ujson = setup_goals
    for goal in newgoals:
        resp = await client.delete(f"/goals/{goal['id']}", headers=headers)

    resp = await client.get("/goals", headers=headers)
    remaining_goals = resp.json()

    assert resp.status_code == 200
    assert len(remaining_goals) == 0
