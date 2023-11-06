from ..app.utils.security import decode_jwt
from .data import LOGINJSON


def assert_token(resp):
    assert resp.status_code == 200
    assert "access_token" in resp.json()
    assert resp.json()["token_type"] == "bearer"
    _decoded = decode_jwt(resp.json()["access_token"])
    assert "sub" in _decoded
    assert _decoded["sub"] == LOGINJSON["username"]
    assert 'exp' in _decoded


def headers(resp):
    assert resp.status_code == 200
    assert_token(resp)
    token = resp.json()["access_token"]
    return {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }


async def register(client):
    return await client.post("/u/register", json=LOGINJSON)


async def login(client):
    return await client.post("/u/login", json=LOGINJSON)


async def ume_resp(client):
    uh = await login(client)
    uh = headers(uh)
    resp = await client.get("/u/me", headers=uh)
    return resp
