from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.types import ASGIApp


# Content Security Policy Middleware
class CSPMiddleware(BaseHTTPMiddleware):
    """Middleware for Content Security Policy (CSP) headers
    to enable /docs and /redocs.
    """

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
    allowed_origins: list[str] = ['*'],
    allowed_methods: list[str] = ['*'],
    allowed_headers: list[str] = ['*'],
    allow_credentials: bool = True,
    expose_headers: list[str] = ['*'],
) -> ASGIApp:
    """
    Apply CORS middleware to the ASGI app with specified options.

    Args:
        app (ASGIApp): The ASGI app to which CORS middleware should be applied.
        allowed_origins (list[str]): List of allowed origins for CORS requests.
        allowed_methods (list[str]): List of allowed HTTP methods.
        allowed_headers (list[str]): List of allowed HTTP headers.
        allow_credentials (bool): Whether to allow credentials in CORS requests.
        expose_headers (list[str]): List of headers to expose to the browser.

    Returns:
        ASGIApp: The ASGI app with CORS middleware applied.
    """
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
