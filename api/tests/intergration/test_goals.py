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
    getheaders_user,
    headers,
    transaction,
    reguser,
    db,
    setup_goals,
)
from .test_user import test_register


@pytest.mark.asyncio
async def test_list_goals(client, transaction, setup_goals):
    """also tests goal create"""
    newgoals, headers, ujson = setup_goals
    resp = await client.get("/goals", headers=headers)
    assert resp.status_code == 200
    goals_from_response = resp.json()
    print(goals_from_response)  # Print the list of goals
    assert len(goals_from_response) == len(newgoals)


@pytest.mark.asyncio
async def test_get_goal(client, transaction, setup_goals):
    newgoals, headers, ujson = setup_goals
    resp = await client.get(f"/goals/{newgoals[0]['id']}", headers=headers)
    assert resp.status_code == 200
    assert resp.json() == newgoals[0]


@pytest.mark.asyncio
async def test_update_goal(client, transaction, setup_goals):
    newgoals, headers, ujson = setup_goals
    resp = await client.put(
        f"/goals/{newgoals[0]['id']}", json={'text': 'UPDATED'}, headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()['text'] == 'UPDATED'


@pytest.mark.asyncio
async def test_delete_goal(client, transaction, setup_goals):
    newgoals, headers, ujson = setup_goals
    # Explicitly delete all goals
    for goal in newgoals:
        resp = await client.delete(f"/goals/{goal['id']}", headers=headers)
        print(resp, resp.status_code, resp.text)

    # Fetch the remaining goals
    resp = await client.get("/goals", headers=headers)
    remaining_goals = resp.json()
    print(remaining_goals)  # Print the list of remaining goals after deletion

    assert resp.status_code == 200
    # After deleting all goals, no goals should remain
    assert len(remaining_goals) == 0
