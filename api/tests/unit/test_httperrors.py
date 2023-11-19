import pytest
import asyncio
from api.app.utils import httperrors as ERR

from fastapi import status
from fastapi.exceptions import HTTPException

_STR = 'test string'


@pytest.mark.asyncio
@pytest.mark.parametrize(
    'custom_exception, status_code',
    [
        (ERR.HTTP400, status.HTTP_400_BAD_REQUEST),
        (ERR.HTTP401, status.HTTP_401_UNAUTHORIZED),
        (ERR.HTTP403, status.HTTP_403_FORBIDDEN),
        (ERR.HTTP404, status.HTTP_404_NOT_FOUND),
        (ERR.HTTP409, status.HTTP_409_CONFLICT),
        (ERR.HTTP422, status.HTTP_422_UNPROCESSABLE_ENTITY),
        (ERR.HTTP500, status.HTTP_500_INTERNAL_SERVER_ERROR),
        (ERR.HTTP501, status.HTTP_501_NOT_IMPLEMENTED),
        (ERR.HTTP502, status.HTTP_502_BAD_GATEWAY),
        (ERR.HTTP503, status.HTTP_503_SERVICE_UNAVAILABLE),
        (ERR.HTTP504, status.HTTP_504_GATEWAY_TIMEOUT),
        (ERR.HTTP505, status.HTTP_505_HTTP_VERSION_NOT_SUPPORTED),
        (ERR.HTTP507, status.HTTP_507_INSUFFICIENT_STORAGE),
    ],
)
async def test_http_exceptions(custom_exception, status_code):
    custom_error = custom_exception(_STR)
    expected_error = HTTPException(status_code, detail=_STR)
    assert custom_error.status_code == expected_error.status_code
    assert custom_error.detail == expected_error.detail
