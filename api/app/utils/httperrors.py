from fastapi import HTTPException, status


class HTTP400(HTTPException):
    def __init__(self, detail: str = "Bad request."):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST, detail=detail
        )


class HTTP401(HTTPException):
    def __init__(
        self, detail: str = "Not authorized to access this resource."
    ):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=detail
        )


class HTTP403(HTTPException):
    def __init__(
        self, detail: str = "Forbidden from accessing this resource."
    ):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class HTTP404(HTTPException):
    def __init__(self, detail: str = "Resource not found."):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class HTTP409(HTTPException):
    def __init__(self, detail: str = "Resource already exists."):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class HTTP422(HTTPException):
    def __init__(self, detail: str = "Unprocessable entity."):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail
        )


class HTTP500(HTTPException):
    def __init__(self, detail: str = "Internal server error."):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail
        )


class HTTP501(HTTPException):
    def __init__(self, detail: str = "Not implemented."):
        super().__init__(
            status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=detail
        )


class HTTP502(HTTPException):
    def __init__(self, detail: str = "Bad gateway."):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY, detail=detail
        )


class HTTP503(HTTPException):
    def __init__(self, detail: str = "Service unavailable."):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=detail
        )


class HTTP504(HTTPException):
    def __init__(self, detail: str = "Gateway timeout."):
        super().__init__(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=detail
        )


class HTTP505(HTTPException):
    def __init__(self, detail: str = "HTTP version not supported."):
        super().__init__(
            status_code=status.HTTP_505_HTTP_VERSION_NOT_SUPPORTED,
            detail=detail,
        )


class HTTP507(HTTPException):
    def __init__(self, detail: str = "Insufficient storage."):
        super().__init__(
            status_code=status.HTTP_507_INSUFFICIENT_STORAGE, detail=detail
        )
