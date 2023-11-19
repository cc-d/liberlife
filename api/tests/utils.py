from ..app.utils.security import decode_jwt
from .data import LOGINJSON


def assert_token(resp, rjson=None):
    if not rjson:
        rjson = resp.json()
    assert resp.status_code == 200
    assert "access_token" in rjson
    assert resp.json()["token_type"] == "bearer"
    _decoded = decode_jwt(rjson["access_token"])
    assert all(k in _decoded for k in ["sub", "exp"])


def headers(resp, ujson=None):
    if not ujson:
        ujson = LOGINJSON
    rjson = resp.json()
    assert_token(resp, rjson)
    return {
        'Authorization': f'Bearer {rjson["access_token"]}',
        'Content-Type': 'application/json',
    }


async def register(client, json=LOGINJSON):
    return await client.post("/u/register", json=json)


async def login(client):
    return await client.post("/u/login", json=LOGINJSON)


async def ume_resp(client):
    uh = await login(client)
    uh = headers(uh)
    resp = await client.get("/u/me", headers=uh)
    return resp
