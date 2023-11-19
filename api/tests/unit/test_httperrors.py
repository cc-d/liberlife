import pytest
from api.app.utils import httperrors as ERR

from fastapi import status
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse

from api.app.utils import httperrors as ERR

_STR = 'test string'


def _errmatch(err1, err2):
    assert err1.status_code == err2.status_code
    assert err1.detail == err2.detail


@pytest.mark.asyncio
async def test_400():
    _errmatch(ERR.HTTP400(_STR), HTTPException(400, detail=_STR))


@pytest.mark.asyncio
async def test_401():
    _errmatch(ERR.HTTP401(_STR), HTTPException(401, detail=_STR))


@pytest.mark.asyncio
async def test_403():
    _errmatch(ERR.HTTP403(_STR), HTTPException(403, detail=_STR))


@pytest.mark.asyncio
async def test_404():
    _errmatch(ERR.HTTP404(_STR), HTTPException(404, detail=_STR))


@pytest.mark.asyncio
async def test_409():
    _errmatch(ERR.HTTP409(_STR), HTTPException(409, detail=_STR))


@pytest.mark.asyncio
async def test_422():
    _errmatch(ERR.HTTP422(_STR), HTTPException(422, detail=_STR))


@pytest.mark.asyncio
async def test_500():
    _errmatch(ERR.HTTP500(_STR), HTTPException(500, detail=_STR))


@pytest.mark.asyncio
async def test_501():
    _errmatch(ERR.HTTP501(_STR), HTTPException(501, detail=_STR))


@pytest.mark.asyncio
async def test_502():
    _errmatch(ERR.HTTP502(_STR), HTTPException(502, detail=_STR))


@pytest.mark.asyncio
async def test_503():
    _errmatch(ERR.HTTP503(_STR), HTTPException(503, detail=_STR))


@pytest.mark.asyncio
async def test_504():
    _errmatch(ERR.HTTP504(_STR), HTTPException(504, detail=_STR))


@pytest.mark.asyncio
async def test_505():
    _errmatch(ERR.HTTP505(_STR), HTTPException(505, detail=_STR))


@pytest.mark.asyncio
async def test_507():
    _errmatch(ERR.HTTP507(_STR), HTTPException(507, detail=_STR))
