import subprocess
from fastapi import FastAPI, Depends, APIRouter
import api.config as config
from .db import get_db
from .middleware import apply_cors_middleware, CSPMiddleware

app = FastAPI(docs_url='/docs', redoc_url='/redoc')
app = apply_cors_middleware(app)

router = APIRouter()

app.include_router(router, prefix='/api')


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
