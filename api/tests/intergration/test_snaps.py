import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.sql import func

from api.app.db import get_adb
from api.app.db.common import async_addcomref
from api.app.db.models import Goal, GoalTask, User
from api.app.schemas import goal as GoalSchema, user as UserSchema
from api.app.utils.dependencies import get_current_user
from api.app.utils.httperrors import HTTP401, HTTP404, HTTP400, HTTP409
from api.tests.utils import assert_token, headers, login, register, ume_resp

from ..common import (
    app,
    client,
    create_db,
    reguser,
    user_and_headers,
    userme,
    event_loop,
)
from ..data import USERNAME, PASSWORD, LOGINJSON, OAUTH_LOGIN_FORM, USERDB
from ..utils import apireq
from myfuncs import ranstr
from logfunc import logf
from .test_goals import setup_goals
from api.app.schemas import snapshot as SnapSchema


@pytest_asyncio.fixture(scope="module")
async def setup_snap(
    client, setup_goals
) -> tuple[SnapSchema.SnapshotOut, dict, UserSchema.UserOut]:
    setup_goals, headers, ujson = setup_goals
    resp = await client.post("/snapshots", headers=headers)
    assert resp.status_code == 200
    assert 'uuid' in resp.json()
    assert 'goals' in resp.json()
    return (
        SnapSchema.SnapshotOut(**resp.json()),
        headers,
        UserSchema.UserOut(**ujson),
    )


@pytest.mark.asyncio
async def test_new_snap(client, setup_snap):
    snap, headers, me = setup_snap
    assert snap.user_id == me.id
    newsnap = await apireq(client.post, "/snapshots", None, headers)
    assert newsnap.status_code == 200
    newsnap = SnapSchema.SnapshotOut(**newsnap.json())
    assert newsnap.user_id == me.id
    assert newsnap.uuid != snap.uuid
    smap = {newsnap.uuid: newsnap, snap.uuid: snap}

    newsnapreq = await apireq(client.get, "/snapshots/%s" % newsnap.uuid)
    assert newsnapreq.status_code == 200

    assert newsnapreq.json()['uuid'] == newsnap.uuid


@pytest.mark.asyncio
async def test_get_all_users_snapshots(client, setup_snap):
    snap, headers, me = setup_snap
    resp = await client.get("/snapshots", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    assert snap.uuid in [s['uuid'] for s in resp.json()]


@pytest.mark.asyncio
async def test_snapshots_401(client, setup_snap):
    snap, uheads, me = setup_snap
    resp = await client.get("/snapshots", headers=None)
    assert resp.status_code == 401

    resp = await client.get(f"/snapshots/{snap.uuid}", headers=None)
    assert resp.status_code == 200

    resp = await client.get(f"/snapshots/{snap.uuid}", headers=uheads)
    assert resp.status_code == 200
    assert resp.json()['uuid'] == snap.uuid


@pytest.mark.asyncio
async def test_snapgoalstasks(client, setup_snap):
    snap, uheads, me = setup_snap
    assert snap.goals is not None
    assert len(snap.goals) >= 1
    assert snap.goals[0].text is not None
    assert snap.goals[0].tasks is not None
    assert len(snap.goals[0].tasks) >= 1
    assert snap.goals[0].tasks[0].text is not None
