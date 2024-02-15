import subprocess
import sys
import logging
from os.path import abspath

sys.path.append(abspath('..'))

from fastapi import FastAPI, Depends, APIRouter
from . import config
from .utils.middleware import apply_cors_middleware, CSPMiddleware
from .routes import ROUTERS

app = FastAPI(docs_url='/docs', redoc_url='/redoc', debug=config.DEBUG)

router = APIRouter(
    prefix="", tags=["root"], responses={404: {"description": "Not found"}}
)


logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s:%(levelname)s:%(name)s | %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)


@router.get('/')
@router.get('/index')
async def index():
    return {'message': 'Hello, world!'}


@router.get('/openapi.json')
async def get_openapi():
    return app.openapi(
        title="API documentation", version="1.0.0", routes=app.routes
    )


app.include_router(router)
for rter in ROUTERS:
    app.include_router(rter)

app = apply_cors_middleware(app)


if (__name__) == "__main__":
    uvcmd = (
        f"uvicorn main:app --host {config.HOST} --port {config.PORT} --reload"
    )
    subprocess.run(uvcmd, shell=True)
