from fastapi import HTTPException, status


class HTTP100(HTTPException):
    def __init__(
        self,
        detail: str = "The server has received the request headers and is waiting for the client to send the request body.",
    ):
        super().__init__(status_code=status.HTTP_100_CONTINUE, detail=detail)


class HTTP101(HTTPException):
    def __init__(
        self,
        detail: str = "The server is switching protocols according to the Upgrade header field sent by the client.",
    ):
        super().__init__(
            status_code=status.HTTP_101_SWITCHING_PROTOCOLS, detail=detail
        )


class HTTP102(HTTPException):
    def __init__(
        self,
        detail: str = "The server is processing the request but will return a response with a 102 Processing status code when it's done.",
    ):
        super().__init__(status_code=status.HTTP_102_PROCESSING, detail=detail)


class HTTP103(HTTPException):
    def __init__(
        self,
        detail: str = "The server is returning early hints for the browser to preload resources.",
    ):
        super().__init__(
            status_code=status.HTTP_103_EARLY_HINTS, detail=detail
        )


class HTTP200(HTTPException):
    def __init__(
        self,
        detail: str = "The request has succeeded and the response body contains the requested data.",
    ):
        super().__init__(status_code=status.HTTP_200_OK, detail=detail)


class HTTP201(HTTPException):
    def __init__(
        self,
        detail: str = "The request has been fulfilled and a new resource has been created.",
    ):
        super().__init__(status_code=status.HTTP_201_CREATED, detail=detail)


class HTTP202(HTTPException):
    def __init__(
        self,
        detail: str = "The request has been accepted for processing, but the processing has not been completed.",
    ):
        super().__init__(status_code=status.HTTP_202_ACCEPTED, detail=detail)


class HTTP203(HTTPException):
    def __init__(
        self,
        detail: str = "The server is returning non-authoritative information, such as a cached copy of the requested resource.",
    ):
        super().__init__(
            status_code=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
            detail=detail,
        )


class HTTP204(HTTPException):
    def __init__(
        self,
        detail: str = "The request has succeeded, but the response body is intentionally empty.",
    ):
        super().__init__(status_code=status.HTTP_204_NO_CONTENT, detail=detail)


class HTTP205(HTTPException):
    def __init__(
        self,
        detail: str = "The request has succeeded, and the client should reset the document view.",
    ):
        super().__init__(
            status_code=status.HTTP_205_RESET_CONTENT, detail=detail
        )


class HTTP206(HTTPException):
    def __init__(
        self,
        detail: str = "The server is delivering only part of the resource due to a range request.",
    ):
        super().__init__(
            status_code=status.HTTP_206_PARTIAL_CONTENT, detail=detail
        )


class HTTP207(HTTPException):
    def __init__(
        self,
        detail: str = "The response is a multi-status response, and each status code has a different status response.",
    ):
        super().__init__(
            status_code=status.HTTP_207_MULTI_STATUS, detail=detail
        )


class HTTP208(HTTPException):
    def __init__(
        self,
        detail: str = "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.",
    ):
        super().__init__(
            status_code=status.HTTP_208_ALREADY_REPORTED, detail=detail
        )


class HTTP226(HTTPException):
    def __init__(
        self,
        detail: str = "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.",
    ):
        super().__init__(status_code=status.HTTP_226_IM_USED, detail=detail)


class HTTP300(HTTPException):
    def __init__(
        self,
        detail: str = "The request has multiple possible responses, and the user or user agent can choose the desired one.",
    ):
        super().__init__(
            status_code=status.HTTP_300_MULTIPLE_CHOICES, detail=detail
        )


class HTTP301(HTTPException):
    def __init__(
        self,
        detail: str = "The requested resource has been permanently moved to a new URL.",
    ):
        super().__init__(
            status_code=status.HTTP_301_MOVED_PERMANENTLY, detail=detail
        )


class HTTP302(HTTPException):
    def __init__(
        self,
        detail: str = "The requested resource has been temporarily found at a different URL.",
    ):
        super().__init__(status_code=status.HTTP_302_FOUND, detail=detail)


class HTTP303(HTTPException):
    def __init__(
        self,
        detail: str = "The response to the request can be found under a different URI and should be retrieved using a GET method.",
    ):
        super().__init__(status_code=status.HTTP_303_SEE_OTHER, detail=detail)


class HTTP304(HTTPException):
    def __init__(
        self,
        detail: str = "The requested resource has not been modified, and the client can use its cached copy.",
    ):
        super().__init__(
            status_code=status.HTTP_304_NOT_MODIFIED, detail=detail
        )


class HTTP305(HTTPException):
    def __init__(
        self,
        detail: str = "The requested resource must be accessed through the proxy given by the Location field.",
    ):
        super().__init__(status_code=status.HTTP_305_USE_PROXY, detail=detail)


class HTTP306(HTTPException):
    def __init__(
        self,
        detail: str = "This status code is no longer used, and the code is reserved for future use.",
    ):
        super().__init__(status_code=status.HTTP_306_RESERVED, detail=detail)


class HTTP307(HTTPException):
    def __init__(
        self,
        detail: str = "The request should be repeated with another URI, but the method used should remain the same.",
    ):
        super().__init__(
            status_code=status.HTTP_307_TEMPORARY_REDIRECT, detail=detail
        )


class HTTP308(HTTPException):
    def __init__(
        self,
        detail: str = "The request and all future requests should be repeated using another URI.",
    ):
        super().__init__(
            status_code=status.HTTP_308_PERMANENT_REDIRECT, detail=detail
        )


class HTTP400(HTTPException):
    def __init__(
        self,
        detail: str = "The server cannot or will not process the request due to a client error.",
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST, detail=detail
        )


class HTTP401(HTTPException):
    def __init__(
        self,
        detail: str = "The request requires user authentication or the provided credentials are invalid.",
    ):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=detail
        )


class HTTP402(HTTPException):
    def __init__(
        self,
        detail: str = "This status code is not commonly used and is reserved for future use.",
    ):
        super().__init__(
            status_code=status.HTTP_402_PAYMENT_REQUIRED, detail=detail
        )


class HTTP403(HTTPException):
    def __init__(
        self,
        detail: str = "The client does not have permission to access the requested resource.",
    ):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class HTTP404(HTTPException):
    def __init__(
        self,
        detail: str = "The requested resource could not be found on the server.",
    ):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class HTTP405(HTTPException):
    def __init__(
        self,
        detail: str = "The request method used is not allowed for the requested resource.",
    ):
        super().__init__(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail=detail
        )


class HTTP406(HTTPException):
    def __init__(
        self,
        detail: str = "The server cannot produce a response matching the list of acceptable values in the request's headers.",
    ):
        super().__init__(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=detail
        )


class HTTP407(HTTPException):
    def __init__(
        self,
        detail: str = "Authentication with a proxy server is required before accessing the requested resource.",
    ):
        super().__init__(
            status_code=status.HTTP_407_PROXY_AUTHENTICATION_REQUIRED,
            detail=detail,
        )


class HTTP408(HTTPException):
    def __init__(
        self,
        detail: str = "The client's request took too long to process, and the server timed out.",
    ):
        super().__init__(
            status_code=status.HTTP_408_REQUEST_TIMEOUT, detail=detail
        )


class HTTP409(HTTPException):
    def __init__(
        self,
        detail: str = "There is a conflict with the current state of the target resource, and the client's request cannot be completed.",
    ):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class HTTP410(HTTPException):
    def __init__(
        self,
        detail: str = "The requested resource has been permanently removed and will not be available in the future.",
    ):
        super().__init__(status_code=status.HTTP_410_GONE, detail=detail)


class HTTP411(HTTPException):
    def __init__(
        self,
        detail: str = "The server requires the 'Content-Length' header to be specified in the request, and it was missing.",
    ):
        super().__init__(
            status_code=status.HTTP_411_LENGTH_REQUIRED, detail=detail
        )


class HTTP412(HTTPException):
    def __init__(
        self,
        detail: str = "The server does not meet the conditions specified in the client's 'If-Match' or 'If-None-Match' headers.",
    ):
        super().__init__(
            status_code=status.HTTP_412_PRECONDITION_FAILED, detail=detail
        )


class HTTP413(HTTPException):
    def __init__(
        self,
        detail: str = "The server cannot process the request because the request entity is too large.",
    ):
        super().__init__(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=detail
        )


class HTTP414(HTTPException):
    def __init__(
        self,
        detail: str = "The server cannot process the request because the requested URI is too long.",
    ):
        super().__init__(
            status_code=status.HTTP_414_REQUEST_URI_TOO_LONG, detail=detail
        )


class HTTP415(HTTPException):
    def __init__(
        self,
        detail: str = "The server cannot process the request because the media type in the request is not supported.",
    ):
        super().__init__(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail=detail
        )


class HTTP416(HTTPException):
    def __init__(
        self,
        detail: str = "The server cannot satisfy the 'Range' header field in the request.",
    ):
        super().__init__(
            status_code=status.HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE,
            detail=detail,
        )


class HTTP417(HTTPException):
    def __init__(
        self,
        detail: str = "The expectation given in the 'Expect' header field could not be met by the server.",
    ):
        super().__init__(
            status_code=status.HTTP_417_EXPECTATION_FAILED, detail=detail
        )


class HTTP418(HTTPException):
    def __init__(
        self,
        detail: str = "I'm a teapot (RFC 2324). This code is not used in real HTTP, and it is an April Fools' joke.",
    ):
        super().__init__(
            status_code=status.HTTP_418_IM_A_TEAPOT, detail=detail
        )


class HTTP421(HTTPException):
    def __init__(
        self,
        detail: str = "The request was directed at a server that is not able to produce a response (for example, because of connection reuse).",
    ):
        super().__init__(
            status_code=status.HTTP_421_MISDIRECTED_REQUEST, detail=detail
        )


class HTTP422(HTTPException):
    def __init__(
        self,
        detail: str = "The server understands the content type of the request entity, but it cannot process the instructions in the request.",
    ):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail
        )


class HTTP423(HTTPException):
    def __init__(
        self, detail: str = "The resource that is being accessed is locked."
    ):
        super().__init__(status_code=status.HTTP_423_LOCKED, detail=detail)


class HTTP424(HTTPException):
    def __init__(
        self,
        detail: str = "The request failed due to a failure of a previous request (e.g., a PROPPATCH).",
    ):
        super().__init__(
            status_code=status.HTTP_424_FAILED_DEPENDENCY, detail=detail
        )


class HTTP425(HTTPException):
    def __init__(
        self,
        detail: str = "The server is unwilling to risk processing a request that might be replayed.",
    ):
        super().__init__(status_code=status.HTTP_425_TOO_EARLY, detail=detail)


class HTTP426(HTTPException):
    def __init__(
        self,
        detail: str = "The client should switch to a different protocol (e.g., TLS/1.0, TLS/1.1) to access the resource.",
    ):
        super().__init__(
            status_code=status.HTTP_426_UPGRADE_REQUIRED, detail=detail
        )


class HTTP428(HTTPException):
    def __init__(
        self,
        detail: str = "The client should conditionally retry the request, but it did not include the required 'If-None-Match' header.",
    ):
        super().__init__(
            status_code=status.HTTP_428_PRECONDITION_REQUIRED, detail=detail
        )


class HTTP429(HTTPException):
    def __init__(
        self,
        detail: str = "The user has sent too many requests in a given amount of time (rate limiting).",
    ):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=detail
        )


class HTTP431(HTTPException):
    def __init__(
        self,
        detail: str = "The server is unwilling to process the request because the request header fields are too large.",
    ):
        super().__init__(
            status_code=status.HTTP_431_REQUEST_HEADER_FIELDS_TOO_LARGE,
            detail=detail,
        )


class HTTP451(HTTPException):
    def __init__(
        self,
        detail: str = "The requested resource is unavailable for legal reasons.",
    ):
        super().__init__(
            status_code=status.HTTP_451_UNAVAILABLE_FOR_LEGAL_REASONS,
            detail=detail,
        )


class HTTP500(HTTPException):
    def __init__(
        self,
        detail: str = "The server encountered an internal error and cannot fulfill the request.",
    ):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail
        )


class HTTP501(HTTPException):
    def __init__(
        self,
        detail: str = "The server does not support the functionality required to fulfill the request.",
    ):
        super().__init__(
            status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=detail
        )


class HTTP502(HTTPException):
    def __init__(
        self,
        detail: str = "The server received an invalid response from an upstream server while trying to fulfill the request.",
    ):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY, detail=detail
        )


class HTTP503(HTTPException):
    def __init__(
        self,
        detail: str = "The server is currently unable to handle the request due to temporary overloading or maintenance of the server.",
    ):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=detail
        )


class HTTP504(HTTPException):
    def __init__(
        self,
        detail: str = "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server or application.",
    ):
        super().__init__(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=detail
        )


class HTTP505(HTTPException):
    def __init__(
        self,
        detail: str = "The server does not support the HTTP protocol version used in the request.",
    ):
        super().__init__(
            status_code=status.HTTP_505_HTTP_VERSION_NOT_SUPPORTED,
            detail=detail,
        )


class HTTP506(HTTPException):
    def __init__(
        self,
        detail: str = "The server has an internal configuration error and cannot complete the request.",
    ):
        super().__init__(
            status_code=status.HTTP_506_VARIANT_ALSO_NEGOTIATES, detail=detail
        )


class HTTP507(HTTPException):
    def __init__(
        self,
        detail: str = "The server is unable to store the representation needed to complete the request.",
    ):
        super().__init__(
            status_code=status.HTTP_507_INSUFFICIENT_STORAGE, detail=detail
        )


class HTTP508(HTTPException):
    def __init__(
        self,
        detail: str = "The server detected an infinite loop while processing the request.",
    ):
        super().__init__(
            status_code=status.HTTP_508_LOOP_DETECTED, detail=detail
        )


class HTTP510(HTTPException):
    def __init__(
        self,
        detail: str = "Further extensions to the request are required for the server to fulfill it.",
    ):
        super().__init__(
            status_code=status.HTTP_510_NOT_EXTENDED, detail=detail
        )


class HTTP511(HTTPException):
    def __init__(
        self,
        detail: str = "Authentication with a network authentication required before accessing the requested resource.",
    ):
        super().__init__(
            status_code=status.HTTP_511_NETWORK_AUTHENTICATION_REQUIRED,
            detail=detail,
        )
