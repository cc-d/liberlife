import pytest
from logfunc import logf
from ..data import GOALS, TASKS, USERNAME, LOGINJSON, OAUTH_LOGIN_FORM
from ..common import (
    assert_token,
    client,
    create_db,
    event_loop,
    headers,
    loginresp,
    reguser,
    user_and_headers,
    userme,
    funcnewuser,
)
from .test_user import test_register
from myfuncs import ranstr
from api.app.schemas import goal as GoalSchema


@logf(level='INFO')
async def new_goal_req(text, client, headers, **kwargs):
    resp = await client.post("/goals", json={'text': text}, headers=headers)
    assert resp.status_code == 200
    return GoalSchema.GoalOut(**resp.json())


@logf(level='INFO')
async def new_taskresp(text, goalid, client, headers, **kwargs):
    resp = await client.post(
        "/goals/%s/tasks" % goalid,
        json={'text': text, 'completed': False},
        headers=headers,
    )
    return resp.json()


@pytest.fixture(scope="function")
async def new_goaltask_func(client, user_and_headers) -> GoalSchema.GoalOut:
    ngtext = ranstr(30)
    uttext = ranstr(30)
    tuser, headers = user_and_headers
    ngoal = await new_goal_req(ngtext, client, headers)
    assert ngoal.text == ngtext
    assert ngoal.user_id == tuser['id']
    assert hasattr(ngoal, 'archived')
    assert ngoal.archived == False

    ntask = await new_taskresp(uttext, ngoal.id, client, headers)
    if isinstance(ntask, dict):
        ntask = GoalSchema.GoalTaskOut(**ntask)
    assert ntask.text == uttext
    assert ntask.goal_id == ngoal.id
    assert ntask.completed == False
    ngoal.tasks = [ntask]
    return ngoal


@pytest.fixture(scope="module")
def setup_goals(client, user_and_headers, event_loop):
    async def _async_setup():
        tuser, headers = user_and_headers
        newgoals = []
        for text in GOALS.TEXTS:
            ng = await new_goal_req(text, client, headers)
            assert ng.text == text
            assert ng.user_id == tuser['id']
            assert hasattr(ng, 'archived')
            assert ng.archived == False
            newgoals.append(ng)

        return newgoals, headers, tuser

    return event_loop.run_until_complete(_async_setup())


@pytest.mark.asyncio
async def test_list_goals(client, setup_goals):
    """also tests goal create"""
    newgoals, headers, ujson = setup_goals
    resp = await client.get("/goals", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) == len(newgoals)
    expected = ['id', 'text', 'user_id', 'archived', 'tasks']
    for goal in resp.json():
        for _attr in expected:
            assert _attr in goal
        assert goal['user_id'] == ujson['id']
        assert goal['archived'] == False
        assert len(goal['tasks']) == 0


@pytest.mark.asyncio
async def test_get_goal(client, setup_goals):
    newgoals, headers, _ = setup_goals
    for goal in newgoals:
        resp = await client.get(f"/goals/{goal.id}", headers=headers)
        assert resp.status_code == 200
        curgoal = GoalSchema.GoalOut(**resp.json())
        for _attr in ['id', 'text', 'user_id', 'archived']:
            assert getattr(curgoal, _attr) == getattr(goal, _attr)
        assert 'archived' in resp.json()


@pytest.mark.asyncio
async def test_update_goal(client, user_and_headers, new_goaltask_func):
    tuser, headers = user_and_headers
    newgoal = await new_goaltask_func

    uid = newgoal.user.id
    # text only
    utext = ranstr(30)
    resp = await client.put(
        f"/goals/{newgoal.id}", json={'text': utext}, headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()['user_id'] == uid
    for _attr in ['id', 'text', 'archived']:
        if _attr == 'text':
            assert resp.json()[_attr] == utext
        else:
            assert resp.json()[_attr] == getattr(newgoal, _attr)

    # test two fields
    utext = ranstr(30)
    resp = await client.put(
        f"/goals/{newgoal.id}",
        json={'text': utext, 'archived': True},
        headers=headers,
    )

    assert resp.status_code == 200
    ugoal = GoalSchema.GoalOut(**resp.json())
    assert ugoal.text == utext
    assert ugoal.user_id == uid
    assert ugoal.archived == True

    # test just completed
    resp = await client.put(
        f"/goals/{newgoal.id}", json={'archive': True}, headers=headers
    )
    assert resp.status_code == 200
    assert resp.json()['archived'] == True
    assert resp.json()['text'] == utext
    assert resp.json()['user_id'] == uid
    assert resp.json()['id'] == newgoal.id


async def allgoals_request(client, headers):
    resp = await client.get("/goals", headers=headers)
    assert resp.status_code == 200
    return [GoalSchema.GoalOut(**g) for g in resp.json()]


@pytest.mark.asyncio
async def test_delete_goal(client, setup_goals):
    newgoals, headers, tuser = setup_goals
    utext = ranstr(30)

    newgoal = await new_goal_req(utext, client, headers)
    assert newgoal.text == utext
    assert newgoal.user_id == tuser['id']
    assert hasattr(newgoal, 'archived')
    assert newgoal.archived == False
    ngid = newgoal.id

    resp = await client.delete(f"/goals/{ngid}", headers=headers)
    assert resp.status_code == 200

    ugoals = await allgoals_request(client, headers)
    ugmap = {g.id: g for g in ugoals}

    for ng in newgoals:
        assert ng.id in ugmap
        assert ugmap[ng.id].text == ng.text
        assert ugmap[ng.id].user_id == ng.user_id
        assert ugmap[ng.id].archived == ng.archived


@pytest.fixture(scope="module")
def setup_tasks(client, setup_goals, event_loop):
    async def _async_setup():
        newgoals, headers, tuser = setup_goals
        for goal in newgoals:
            for text in TASKS.TEXTS:
                await new_taskresp(text, goal.id, client, headers)
        return newgoals, headers, tuser

    return event_loop.run_until_complete(_async_setup())


@pytest.mark.asyncio
async def test_create_task(client, setup_tasks):
    newgoals, headers, ujson = setup_tasks

    for goal in newgoals:
        resp = await client.get(f"/goals/{goal.id}", headers=headers)
        assert resp.status_code == 200
        curgoal = GoalSchema.GoalOut(**resp.json())
        assert len(curgoal.tasks) == len(TASKS.TEXTS)
        for task in curgoal.tasks:
            assert task.goal_id == goal.id

            assert task.completed == False
            assert task.text in TASKS.TEXTS


@pytest.mark.asyncio
async def test_get_task(client, setup_tasks):
    newgoals, headers, _ = setup_tasks

    for goal in newgoals:
        for task in goal.tasks:
            resp = await client.get(
                f"/goals/{goal.id}/tasks/{task['id']}", headers=headers
            )
            assert resp.status_code == 200
            assert resp.json()['text'] == task['text']


@pytest.mark.asyncio
async def test_update_task(client, setup_tasks):
    newgoals, headers, _ = setup_tasks

    original = {}

    for goal in newgoals:
        for task in goal.tasks:
            original[task['id']] = task
            resp = await client.put(
                f"/goals/{goal.id}/tasks/{task['id']}",
                json={'text': 'UPDATED'},
                headers=headers,
            )
            assert resp.status_code == 200
            assert resp.json()['text'] == 'UPDATED'
            assert resp.json()['id'] == task['id']

    # now change them back incase same session
    for goal in newgoals:
        for task in goal.tasks:
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


@pytest.fixture(scope="function")
async def new_task_func(
    client, user_and_headers, event_loop
) -> GoalSchema.GoalOut:
    ngtext = ranstr(30)
    uttext = ranstr(30)
    tuser, headers = user_and_headers
    ngoal = await new_goal_req(ngtext, client, headers)
    assert ngoal.text == ngtext
    assert ngoal.user_id == tuser['id']
    assert hasattr(ngoal, 'archived')
    assert ngoal.archived == False

    ntask = await new_taskresp(uttext, ngoal.id, client, headers)
    if isinstance(ntask, dict):
        ntask = GoalSchema.GoalTaskOut(**ntask)
    assert ntask.text == uttext
    assert ntask.goal_id == ngoal.id
    assert ntask.completed == False
    ngoal.tasks = [ntask]
    return ngoal


@pytest.mark.asyncio
async def test_delete_task(client, user_and_headers, new_task_func):
    ujson, headers = user_and_headers
    ngoal = await new_task_func
    ugtext = ngoal.text
    uttext = ngoal.tasks[0].text

    resp = await client.post(
        f"/goals/{ngoal.id}/tasks",
        json={'text': uttext, 'completed': False},
        headers=headers,
    )
    ntask = GoalSchema.GoalTaskOut(**resp.json())
    assert ntask.text == uttext
    assert ntask.goal_id == ngoal.id
    assert ntask.completed == False

    resp = await client.delete(
        f"/goals/{ngoal.id}/tasks/{ntask.id}", headers=headers
    )
    assert resp.status_code == 200

    resp = await client.get(f"/goals/{ngoal.id}", headers=headers)
    assert resp.status_code == 200
    rgoal = GoalSchema.GoalOut(**resp.json())
    assert len(rgoal.tasks) == len(ngoal.tasks)
    assert rgoal.text == ugtext
    assert rgoal.user_id == ujson['id']


@pytest.mark.asyncio
async def test_goal_401s(client, funcnewuser, new_task_func):
    ume, umehead = await funcnewuser
    ng = await new_task_func

    ngid = ng.id
    ntid = ng.tasks[0].id
    urlmethods = {
        '/goals': ['get'],
        '/goals/%s' % ngid: ['get', 'put', 'delete'],
        '/goals/%s/tasks' % ngid: ['get', 'post'],
    }
    urlmethods['/goals/%s/tasks/%s' % (ngid, ntid)] = ['get', 'put', 'delete']

    async def _401urls():
        for url, methods in urlmethods.items():
            for method in methods:
                yield getattr(client, method)(url, headers=umehead)

    async for resp in _401urls():
        resp = await resp
        assert resp.status_code == 401


@pytest.mark.asyncio
async def test_snapshots(client, user_and_headers, event_loop, setup_goals):
    setup_goals, headers, ujson = setup_goals
    ujson, headers = user_and_headers
    resp = await client.get("/snapshots", headers=headers)
    assert resp.status_code == 200

    assert len(resp.json()) == 0

    resp = await client.post("/snapshots", headers=headers)
    assert resp.status_code == 200
    assert 'uuid' in resp.json()
    assert 'goals' in resp.json()


@pytest.mark.asyncio
async def test_snapshots_401(client, setup_goals):
    setup_goals, headers, ujson = setup_goals
    resp = await client.get("/snapshots", headers=None)
    assert resp.status_code == 401

    resp = await client.post("/snapshots", headers=headers)
    assert resp.status_code == 200

    snapid = resp.json()['uuid']

    resp = await client.get(f"/snapshots/{snapid}", headers=None)
    assert resp.status_code == 200
