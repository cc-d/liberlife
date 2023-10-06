from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..schemas import task_updates as TaskUpdateSchema
from ..db import get_adb
from ..db.models import TaskUpdate
from ..utils.dependencies import get_current_user
from ..db.common import async_addcomref

router = APIRouter(prefix='/tu', tags=['task_updates'])


@router.post("/", response_model=TaskUpdateSchema.TaskUpdateOut)
async def create_task_update(
    task_update: TaskUpdateSchema.TaskUpdateIn,
    db: AsyncSession = Depends(get_adb),
):
    new_update = TaskUpdate(**task_update.dict())
    await async_addcomref(db, new_update)
    return new_update


@router.get("/{task_update_id}/", response_model=TaskUpdateSchema.TaskUpdateOut)
async def get_task_update(
    task_update_id: int, db: AsyncSession = Depends(get_adb)
):
    result = await db.execute(
        select(TaskUpdate).where(TaskUpdate.id == task_update_id)
    )
    update = result.scalar_one_or_none()
    if not update:
        raise HTTPException(status_code=404, detail="Task Update not found")
    return update


@router.put("/{task_update_id}/", response_model=TaskUpdateSchema.TaskUpdateOut)
async def update_task_update(
    task_update_id: int,
    update_data: TaskUpdateSchema.TaskUpdateIn,
    db: AsyncSession = Depends(get_adb),
):
    result = await db.execute(
        select(TaskUpdate).where(TaskUpdate.id == task_update_id)
    )
    update = result.scalar_one_or_none()
    if not update:
        raise HTTPException(status_code=404, detail="Task Update not found")
    for key, value in update_data.dict().items():
        setattr(update, key, value)
    await db.commit()
    await db.refresh(update)
    return update


@router.delete("/{task_update_id}/")
async def delete_task_update(
    task_update_id: int, db: AsyncSession = Depends(get_adb)
):
    result = await db.execute(
        select(TaskUpdate).where(TaskUpdate.id == task_update_id)
    )
    update = result.scalar_one_or_none()
    if not update:
        raise HTTPException(status_code=404, detail="Task Update not found")
    await db.delete(update)
    await db.commit()
    return {"detail": "Task Update deleted successfully"}
