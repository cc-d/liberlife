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
    session,
    OAUTH_LOGIN_FORM,
    GOALS,
    get_headers_user,
)
from .test_user import test_register


@pytest.mark.asyncio
async def test_create_goals(client, session, get_headers_user):
    headers, ujson = await get_headers_user
    newgoals = []

    for gt in GOALS.TEXTS:
        resp = await client.post("/goals", json={'text': gt}, headers=headers)
        assert resp.status_code == 200
        newgoals.append(resp.json())
    return newgoals, headers, ujson


@pytest.mark.asyncio
async def test_list_goals(client, session, get_headers_user):
    newgoals, headers, ujson = await test_create_goals(
        client, session, get_headers_user
    )
    resp = await client.get("/goals", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) == len(newgoals)


@pytest.mark.asyncio
async def test_get_goal(client, session, get_headers_user):
    newgoals, headers, ujson = await test_create_goals(
        client, session, get_headers_user
    )
    resp = await client.get(f"/goals/{newgoals[0]['id']}", headers=headers)
    assert resp.status_code == 200
    assert resp.json() == newgoals[0]


@pytest.mark.asyncio
async def test_update_goal(client, session, get_headers_user):
    newgoals, headers, ujson = await test_create_goals(
        client, session, get_headers_user
    )
    resp = await client.put(
        f"/goals/{newgoals[0]['id']}", json={'text': 'UPDATED'}, headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()['text'] == 'UPDATED'


@pytest.mark.asyncio
async def test_delete_goal(client, session, get_headers_user):
    newgoals, headers, ujson = await test_create_goals(
        client, session, get_headers_user
    )
    print(newgoals, headers, ujson, sep='\n')
    resp = await client.delete(f"/goals/{newgoals[0]['id']}", headers=headers)
    assert resp.status_code == 200
    resp = await client.get("/goals", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) == len(newgoals) - 1
