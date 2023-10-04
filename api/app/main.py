import subprocess
import sys
from os.path import abspath

sys.path.append(abspath('..'))

from fastapi import FastAPI, Depends, APIRouter
from . import config
from .db.main import get_db
from .utils.middleware import apply_cors_middleware, CSPMiddleware
from .routes import ROUTERS

app = FastAPI(docs_url='/docs', redoc_url='/redoc')
app = apply_cors_middleware(app)

router = APIRouter()

app.include_router(router)


@router.get('/')
async def index():
    return {'message': 'Hello, world!'}


@router.get('/openapi.json')
async def get_openapi():
    return app.openapi(
        title="API documentation", version="1.0.0", routes=app.routes
    )


if (__name__) == "__main__":
    uvcmd = (
        f"uvicorn main:app --host {config.HOST} --port {config.PORT} --reload"
    )
    subprocess.run(uvcmd, shell=True)


for rter in ROUTERS:
    app.include_router(rter[0], prefix=rter[1])
