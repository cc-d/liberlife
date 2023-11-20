import pytest
from fastapi.exceptions import HTTPException
from fastapi import status
from api.app.utils import httperrors as ERR

_STR = 'test string'


@pytest.mark.asyncio
@pytest.mark.parametrize(
    'custom_exception, status_code',
    [
        (ERR.HTTP100, status.HTTP_100_CONTINUE),
        (ERR.HTTP101, status.HTTP_101_SWITCHING_PROTOCOLS),
        (ERR.HTTP102, status.HTTP_102_PROCESSING),
        (ERR.HTTP103, status.HTTP_103_EARLY_HINTS),
        (ERR.HTTP200, status.HTTP_200_OK),
        (ERR.HTTP201, status.HTTP_201_CREATED),
        (ERR.HTTP202, status.HTTP_202_ACCEPTED),
        (ERR.HTTP203, status.HTTP_203_NON_AUTHORITATIVE_INFORMATION),
        (ERR.HTTP204, status.HTTP_204_NO_CONTENT),
        (ERR.HTTP205, status.HTTP_205_RESET_CONTENT),
        (ERR.HTTP206, status.HTTP_206_PARTIAL_CONTENT),
        (ERR.HTTP207, status.HTTP_207_MULTI_STATUS),
        (ERR.HTTP208, status.HTTP_208_ALREADY_REPORTED),
        (ERR.HTTP226, status.HTTP_226_IM_USED),
        (ERR.HTTP300, status.HTTP_300_MULTIPLE_CHOICES),
        (ERR.HTTP301, status.HTTP_301_MOVED_PERMANENTLY),
        (ERR.HTTP302, status.HTTP_302_FOUND),
        (ERR.HTTP303, status.HTTP_303_SEE_OTHER),
        (ERR.HTTP304, status.HTTP_304_NOT_MODIFIED),
        (ERR.HTTP305, status.HTTP_305_USE_PROXY),
        (ERR.HTTP306, status.HTTP_306_RESERVED),
        (ERR.HTTP307, status.HTTP_307_TEMPORARY_REDIRECT),
        (ERR.HTTP308, status.HTTP_308_PERMANENT_REDIRECT),
        (ERR.HTTP400, status.HTTP_400_BAD_REQUEST),
        (ERR.HTTP401, status.HTTP_401_UNAUTHORIZED),
        (ERR.HTTP402, status.HTTP_402_PAYMENT_REQUIRED),
        (ERR.HTTP403, status.HTTP_403_FORBIDDEN),
        (ERR.HTTP404, status.HTTP_404_NOT_FOUND),
        (ERR.HTTP405, status.HTTP_405_METHOD_NOT_ALLOWED),
        (ERR.HTTP406, status.HTTP_406_NOT_ACCEPTABLE),
        (ERR.HTTP407, status.HTTP_407_PROXY_AUTHENTICATION_REQUIRED),
        (ERR.HTTP408, status.HTTP_408_REQUEST_TIMEOUT),
        (ERR.HTTP409, status.HTTP_409_CONFLICT),
        (ERR.HTTP410, status.HTTP_410_GONE),
        (ERR.HTTP411, status.HTTP_411_LENGTH_REQUIRED),
        (ERR.HTTP412, status.HTTP_412_PRECONDITION_FAILED),
        (ERR.HTTP413, status.HTTP_413_REQUEST_ENTITY_TOO_LARGE),
        (ERR.HTTP414, status.HTTP_414_REQUEST_URI_TOO_LONG),
        (ERR.HTTP415, status.HTTP_415_UNSUPPORTED_MEDIA_TYPE),
        (ERR.HTTP416, status.HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE),
        (ERR.HTTP417, status.HTTP_417_EXPECTATION_FAILED),
        (ERR.HTTP418, status.HTTP_418_IM_A_TEAPOT),
        (ERR.HTTP421, status.HTTP_421_MISDIRECTED_REQUEST),
        (ERR.HTTP422, status.HTTP_422_UNPROCESSABLE_ENTITY),
        (ERR.HTTP423, status.HTTP_423_LOCKED),
        (ERR.HTTP424, status.HTTP_424_FAILED_DEPENDENCY),
        (ERR.HTTP425, status.HTTP_425_TOO_EARLY),
        (ERR.HTTP426, status.HTTP_426_UPGRADE_REQUIRED),
        (ERR.HTTP428, status.HTTP_428_PRECONDITION_REQUIRED),
        (ERR.HTTP429, status.HTTP_429_TOO_MANY_REQUESTS),
        (ERR.HTTP431, status.HTTP_431_REQUEST_HEADER_FIELDS_TOO_LARGE),
        (ERR.HTTP451, status.HTTP_451_UNAVAILABLE_FOR_LEGAL_REASONS),
        (ERR.HTTP500, status.HTTP_500_INTERNAL_SERVER_ERROR),
        (ERR.HTTP501, status.HTTP_501_NOT_IMPLEMENTED),
        (ERR.HTTP502, status.HTTP_502_BAD_GATEWAY),
        (ERR.HTTP503, status.HTTP_503_SERVICE_UNAVAILABLE),
        (ERR.HTTP504, status.HTTP_504_GATEWAY_TIMEOUT),
        (ERR.HTTP505, status.HTTP_505_HTTP_VERSION_NOT_SUPPORTED),
        (ERR.HTTP506, status.HTTP_506_VARIANT_ALSO_NEGOTIATES),
        (ERR.HTTP507, status.HTTP_507_INSUFFICIENT_STORAGE),
        (ERR.HTTP508, status.HTTP_508_LOOP_DETECTED),
        (ERR.HTTP510, status.HTTP_510_NOT_EXTENDED),
        (ERR.HTTP511, status.HTTP_511_NETWORK_AUTHENTICATION_REQUIRED),
    ],
)
async def test_http_exceptions(custom_exception, status_code):
    custom_error = custom_exception(_STR)
    expected_error = HTTPException(status_code, detail=_STR)
    assert custom_error.status_code == expected_error.status_code
    assert custom_error.detail == expected_error.detail
