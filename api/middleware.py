from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.types import ASGIApp


# Content Security Policy Middleware
class CSPMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        csp_directives = (
            "default-src 'self'; "
            "img-src 'self' data: https://fastapi.tiangolo.com; "
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "worker-src 'self' blob:; "
        )
        response.headers["Content-Security-Policy"] = csp_directives
        return response


def apply_cors_middleware(
    app: ASGIApp,
    allowed_origins: list = ['*'],
    allowed_methods: list = ['*'],
    allowed_headers: list = ['*'],
    allow_credentials: bool = True,
    expose_headers: list = [],
) -> ASGIApp:
    '''
    Apply CORS (Cross-Origin Resource Sharing) middleware to the ASGI app.

    This function adds the CORSMiddleware to the provided ASGI app with the specified
    configuration options.

    Args:
        app (ASGIApp): The ASGI app to which CORS middleware should be applied.
        allowed_origins (list, optional): List of allowed origins for CORS requests.
            Defaults to ['*'].
        allowed_methods (list, optional): List of allowed HTTP methods.
            Defaults to ['*'].
        allowed_headers (list, optional): List of allowed HTTP headers.
            Defaults to ['*'].
        allow_credentials (bool, optional): Whether to allow credentials (e.g., cookies)
            to be included in CORS requests. Defaults to True.
        expose_headers (list, optional): List of headers that should be exposed to
            the browser. Defaults to an empty list.

    Returns:
        ASGIApp: The ASGI app with CORS middleware applied.
    '''
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_methods=allowed_methods,
        allow_headers=allowed_headers,
        allow_credentials=allow_credentials,
        expose_headers=expose_headers,
    )
    app.add_middleware(CSPMiddleware)
    return app
