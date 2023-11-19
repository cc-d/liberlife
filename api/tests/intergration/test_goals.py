import pytest
import pytest_asyncio
from logfunc import logf
from ..data import USERNAME, LOGINJSON, OAUTH_LOGIN_FORM
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
from ..utils import apireq
from .test_user import test_register
from myfuncs import ranstr
from api.app.schemas import goal as GoalSchema

G_ATTRS = ['id', 'text', 'user_id', 'archived']


class GOALS:
    TEXTS = [ranstr(5, 20) for _ in range(3)]


class TASKS:
    TEXTS = [ranstr(5, 20) for _ in range(2)]


@logf(level='INFO')
def match_attrs(goal, goal2, mattrs=G_ATTRS):
    for attr in mattrs:
        assert getattr(goal, attr) == getattr(goal2, attr)
    return True


@logf(level='INFO')
async def new_goal_req(text, client, headers, **kwargs):
    resp = await apireq(
        client.post, "/goals", {'text': text}, headers, **kwargs
    )
    assert resp.status_code == 200
    return GoalSchema.GoalOut(**resp.json())


@logf(level='INFO')
async def new_task_req(text, goalid, client, headers, **kwargs):
    resp = await apireq(
        client.post,
        f"/goals/{goalid}/tasks",
        {'text': text},
        headers,
        **kwargs,
    )
    assert resp.status_code == 200
    return GoalSchema.GoalTaskOut(**resp.json())


@pytest.fixture(scope="function")
async def new_goaltask_func(client, user_and_headers) -> GoalSchema.GoalOut:
    ngtext = ranstr(30)
    uttext = ranstr(30)
    tuser, headers = user_and_headers
    ngoal = await new_goal_req(ngtext, client, headers)

    ntask = await new_task_req(uttext, ngoal.id, client, headers)
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
        assert ng.archived == False
        for ttext in TASKS.TEXTS:
            ntask = await new_task_req(ttext, ng.id, client, headers)

            assert ntask.text == ttext
            assert ntask.goal_id == ng.id
            assert ntask.completed == False

            ng.tasks.append(ntask)
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
            await new_task_req(text, goal.id, client, headers=headers)
    return newgoals, headers, tuser


@pytest.mark.asyncio
async def test_create_task(client, setup_tasks):
    newgoals, headers, ujson = setup_tasks
    pass


@pytest.mark.asyncio
async def test_get_task(client, setup_tasks):
    newgoals, headers, _ = setup_tasks
    tasks = zip([g.tasks for g in newgoals])
    print(tasks)


@pytest.mark.asyncio
async def test_update_task(client, setup_tasks):
    newgoals, headers, _ = setup_tasks

    # update tasks
    for goal in newgoals:
        for task in goal.tasks:
            resp = await apireq(
                client.put,
                f"/goals/{goal.id}/tasks/{task.id}",
                {'text': 'UPDATED'},
                headers,
            )
            assert resp.status_code == 200
            rtuple = tuple(
                resp.json()[k] for k in ['text', 'completed', 'goal_id', 'id']
            )
            assert rtuple == ('UPDATED', False, goal.id, task.id)


@pytest.fixture(scope="function")
async def new_task_func(client, user_and_headers) -> GoalSchema.GoalOut:
    ngtext = ranstr(30)
    uttext = ranstr(30)
    tuser, headers = user_and_headers
    ngoal = await new_goal_req(ngtext, client, headers)

    ntask = await new_task_req(uttext, ngoal.id, client, headers)
    if isinstance(ntask, dict):
        ntask = GoalSchema.GoalTaskOut(**ntask)
    ngoal.tasks = [ntask]
    return ngoal


@pytest.mark.asyncio
async def test_delete_task(client, user_and_headers):
    ujson, headers = user_and_headers
    goals = await apireq(client.get, "/goals", headers=headers)
    gid = goals.json()[0]['id']
    resp = await apireq(
        client.post, f"/goals/{gid}/tasks", {'text': ranstr(30)}, headers
    )
    ntask = GoalSchema.GoalTaskOut(**resp.json())
    resp = await client.delete(
        f"/goals/{gid}/tasks/{ntask.id}", headers=headers
    )
    assert resp.status_code == 200
    resp = await apireq(client.get, f"/goals/{gid}/tasks", headers=headers)
    assert resp.status_code == 200
    assert ntask.id not in [x['id'] for x in resp.json()]

    resp = await apireq(client.get, "/goals", headers=headers)
    assert resp.status_code == 200
    assert ntask.id not in [x['id'] for x in resp.json()[0]['tasks']]

    resp = await apireq(
        client.get, f"/goals/{gid}/tasks/{ntask.id}", headers=headers
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_goaltask_401s(client, user_and_headers, new_task_func):
    ujson, headers = user_and_headers
    ng = await new_task_func

    gid = ng.id
    tid = ng.tasks[0].id
    urlmethods = {
        '/goals': ['get'],
        '/goals/%s' % gid: ['get', 'put', 'delete'],
        '/goals/%s/tasks' % gid: ['get', 'post'],
    }
    urlmethods['/goals/%s/tasks/%s' % (gid, tid)] = ['get', 'put', 'delete']

    for url, methods in urlmethods.items():
        for method in methods:
            resp = await apireq(getattr(client, method), url, headers=None)
            assert resp.status_code == 401
