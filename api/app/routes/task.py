from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..schemas import task as TaskSchema, task_updates as TaskUpdateSchema
from ..db import get_adb
from ..db.models import Task, TaskUpdate
from ..utils.dependencies import get_current_user
from ..db.common import async_addcomref

router = APIRouter(prefix='/t', tags=['task'])


@router.post("/", response_model=TaskSchema.TaskOut)
async def create_task(
    task: TaskSchema.TaskIn,
    cur_user: TaskSchema.UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    new_task = Task(**task.model_dump(), user_id=cur_user.id)
    await async_addcomref(db, new_task)
    return new_task


@router.get("/", response_model=List[TaskSchema.TaskOut])
async def list_tasks(
    cur_user=Depends(get_current_user), db: AsyncSession = Depends(get_adb)
):
    tasks = await db.execute(select(Task).where(Task.user_id == cur_user.id))
    tasks = tasks.scalars().all()
    return tasks


@router.get(
    "/{task_id}/updates", response_model=List[TaskUpdateSchema.TaskUpdateOut]
)
async def list_task_updates(task_id: int, db: AsyncSession = Depends(get_adb)):
    updates = await db.execute(
        select(TaskUpdate).where(TaskUpdate.task_id == task_id)
    )
    return updates.scalars().all()


# Add more routes as needed...
