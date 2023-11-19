import pytest
import pytest_asyncio
from logfunc import logf
from ..data import GOALS, TASKS, USERNAME, LOGINJSON, OAUTH_LOGIN_FORM
from ..common import (
    assert_token,
    client,
    create_db,
    headers,
    reguser,
    user_and_headers,
    userme,
    event_loop,
)
from .test_user import test_register
from myfuncs import ranstr
from api.app.schemas import goal as GoalSchema

G_ATTRS = ['id', 'text', 'user_id', 'archived']


@logf(level='INFO')
def match_attrs(goal, goal2, mattrs=G_ATTRS):
    for attr in mattrs:
        assert getattr(goal, attr) == getattr(goal2, attr)
    return True


@logf(level='INFO')
async def new_goal_req(text, client, headers, **kwargs):
    resp = await client.post("/goals", json={'text': text}, headers=headers)
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

    ntask = await new_taskresp(uttext, ngoal.id, client, headers)
    if isinstance(ntask, dict):
        ntask = GoalSchema.GoalTaskOut(**ntask)

    ngoal.tasks = [ntask]
    return ngoal


@pytest_asyncio.fixture(scope="module")
async def setup_goals(client, user_and_headers):
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


@pytest.mark.asyncio
async def test_list_goals(client, setup_goals):
    """also tests goal create"""
    newgoals, headers, ujson = setup_goals
    resp = await client.get("/goals", headers=headers)
    assert resp.status_code == 200
    rgoals = [GoalSchema.GoalOut(**x) for x in resp.json()]
    rgoals = {g.id: g for g in rgoals}

    for ng in newgoals:
        match_attrs(ng, rgoals[ng.id])


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
    _rs = ranstr(30)

    resp = await client.get(f"/goals/{newgoal.id}", headers=headers)
    assert resp.status_code == 200
    curgoal = GoalSchema.GoalOut(**resp.json())
    assert match_attrs(curgoal, newgoal)

    jpay = {'text': 'updated', 'archived': True}
    resp = await client.put(f"/goals/{newgoal.id}", json=jpay, headers=headers)
    assert resp.status_code == 200
    for k, v in jpay.items():
        assert resp.json()[k] == v

    resp = await client.get(f"/goals/{newgoal.id}", headers=headers)
    assert resp.status_code == 200
    curgoal = GoalSchema.GoalOut(**resp.json())
    assert curgoal.text == 'updated'
    assert curgoal.archived == True

    resp = await client.put(
        f"/goals/{newgoal.id}",
        json={'text': newgoal.text, 'archived': False},
        headers=headers,
    )

    assert resp.status_code == 200
    assert resp.json()['text'] == newgoal.text
    assert resp.json()['archived'] == False


@pytest.mark.asyncio
async def test_delete_goal(client, setup_goals):
    newgoals, headers, tuser = setup_goals
    utext = ranstr(30)
    resp = await client.post("/goals", json={'text': utext}, headers=headers)
    assert resp.status_code == 200
    ngid = resp.json()['id']

    resp = await client.delete(f"/goals/{ngid}", headers=headers)
    assert resp.status_code == 200

    ugoals = await client.get("/goals", headers=headers)
    ugoals = [x['id'] for x in ugoals.json()]
    assert ngid not in ugoals


@pytest.mark.asyncio
async def test_update_goal_notes(client, setup_goals):
    newgoals, headers, tuser = setup_goals
    goal_to_update = newgoals[0]
    updated_notes = "Updated Notes"
    resp = await client.put(
        f"/goals/{goal_to_update.id}/notes",
        json={'notes': updated_notes},
        headers=headers,
    )
    assert resp.status_code == 200
    assert resp.json()['notes'] == updated_notes


@pytest_asyncio.fixture(scope="module")
async def setup_tasks(client, setup_goals):
    newgoals, headers, tuser = setup_goals
    for goal in newgoals:
        for text in TASKS.TEXTS:
            await new_taskresp(text, goal.id, client, headers=headers)
    return newgoals, headers, tuser


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
async def new_task_func(client, user_and_headers) -> GoalSchema.GoalOut:
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
async def test_goal_401s(client, user_and_headers, new_task_func):
    ujson, headers = user_and_headers
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
                yield getattr(client, method)(url, headers=None)

    async for resp in _401urls():
        resp = await resp
        assert resp.status_code == 401


@pytest.mark.asyncio
async def test_snapshots(client, user_and_headers, setup_goals):
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

    resp = await client.get(f"/snapshots/{snapid}", headers=headers)
    assert resp.status_code == 200

    assert resp.json()['uuid'] == snapid
    assert 'goals' in resp.json()
    assert resp.json()['goals'] != []


@pytest.mark.asyncio
async def test_get_update_delete_task(client, setup_goals):
    # Assuming a task has been added to a goal in a previous test
    newgoals, headers, tuser = setup_goals
    goal = newgoals[0]

    # Get the first task of the goal
    tasks_resp = await client.get(f"/goals/{goal.id}/tasks", headers=headers)
    task = tasks_resp.json()[0]

    # Update the task
    updated_text = "Updated Task"
    update_resp = await client.put(
        f"/goals/{goal.id}/tasks/{task['id']}",
        json={'completed': True},
        headers=headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()['completed'] == True
    assert update_resp.json()['goal_id'] == goal.id
    assert update_resp.json()['id'] == task['id']
    # Delete the task
    delete_resp = await client.delete(
        f"/goals/{goal.id}/tasks/{task['id']}", headers=headers
    )
    assert delete_resp.status_code == 200

    # VERify it's gone
    tasks_resp = await client.get(f"/goals/{goal.id}/tasks", headers=headers)
    assert task['id'] not in [x['id'] for x in tasks_resp.json()]
