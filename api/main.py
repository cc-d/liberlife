from fastapi import FastAPI, Depends
from .db import get_db

app = FastAPI()


@app.get('/')
async def index():
    return {'message': 'Hello, world!'}
