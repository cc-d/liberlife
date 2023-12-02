from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from ..db import get_adb
from ..db.models import GoalTemplate, TemplateTask, User
from ..schemas.goal import (
    GoalTemplateDB,
    TemplateTaskDB,
    GoalTemplateIn,
    TemplateTaskIn,
)
from ..utils.httperrors import HTTP404, HTTP409, HTTP401, HTTP400
from ..utils.dependencies import get_current_user

router = APIRouter()


async def get_template_or_404(
    template_id: int, user: User, db: AsyncSession = Depends(get_adb)
) -> GoalTemplate:
    template = (
        db.query(GoalTemplate)
        .filter(
            GoalTemplate.id == template_id, GoalTemplate.user_id == user.id
        )
        .first()
    )
    if template is None:
        raise HTTP404(detail="Template not found")
    return template


async def get_task_or_404(
    task_id: int, template_id: int, db: AsyncSession = Depends(get_adb)
) -> TemplateTask:
    task = await db.execute(
        select(TemplateTask)
        .filter(TemplateTask.id == task_id)
        .options(selectinload(TemplateTask.template_id == template_id))
    )
    task = task.scalar_one_or_none()

    if task is None:
        raise HTTP404(detail="Task not found")
    return task


@router.post("/templates", response_model=GoalTemplateDB)
async def create_goal_template(
    template_in: GoalTemplateIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    new_template = GoalTemplate(**template_in.model_dump(), user_id=user.id)
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    return new_template


@router.get("/templates", response_model=List[GoalTemplateDB])
async def list_goal_templates(
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_adb)
):
    gtemps = await db.execute(
        select(GoalTemplate)
        .filter(GoalTemplate.user_id == user.id)
        .options(selectinload(GoalTemplate.tasks))
    )
    return gtemps.scalars().all()


@router.put("/templates/{template_id}", response_model=GoalTemplateDB)
async def update_goal_template(
    template_id: int,
    template_in: GoalTemplateIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    template = await get_template_or_404(template_id, user, db)
    for var, value in vars(template_in).items():
        setattr(template, var, value) if value else None
    await db.commit()
    await db.refresh(template)
    return template


@router.delete("/templates/{template_id}")
async def delete_goal_template(
    template_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    template = await get_template_or_404(template_id, user, db)
    await db.delete(template)
    await db.commit()
    return {"detail": "Template deleted successfully"}


@router.post("/templates/{template_id}/tasks", response_model=TemplateTaskDB)
async def add_task_to_template(
    template_id: int,
    task_in: TemplateTaskIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    await get_template_or_404(template_id, user, db)
    task = TemplateTask(**task_in.dict(), template_id=template_id)
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


@router.get(
    "/templates/{template_id}/tasks", response_model=List[TemplateTaskDB]
)
async def list_tasks_in_template(
    template_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    result = await db.execute(
        select(TemplateTask).filter(TemplateTask.template_id == template_id)
    )
    return result.scalars().all()


@router.put(
    "/templates/{template_id}/tasks/{task_id}", response_model=TemplateTaskDB
)
async def update_task_in_template(
    template_id: int,
    task_id: int,
    task_in: TemplateTaskIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    await get_template_or_404(template_id, user, db)
    task = await get_task_or_404(task_id, template_id, db)
    for var, value in vars(task_in).items():
        setattr(task, var, value) if value else None
    await db.commit()
    await db.refresh(task)
    return task


@router.delete("/templates/{template_id}/tasks/{task_id}")
async def delete_task_from_template(
    template_id: int,
    task_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    await get_template_or_404(template_id, user, db)
    task = await get_task_or_404(task_id, template_id, db)
    await db.delete(task)
    await db.commit()
    return {"detail": "Task deleted successfully"}
