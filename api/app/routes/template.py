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
    GoalTemplateUpdate,
)
from ..utils.httperrors import HTTP404, HTTP409, HTTP401, HTTP400
from ..utils.dependencies import get_current_user
from ..db.common import async_addcomref

router = APIRouter()


async def get_template_or_404(
    template_id: int, user: User, db: AsyncSession = Depends(get_adb)
) -> GoalTemplate:
    template = await db.execute(
        select(GoalTemplate)
        .filter(GoalTemplate.id == template_id)
        .options(selectinload(GoalTemplate.tasks))
    )
    template = template.scalar_one_or_none()
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
    new_template = GoalTemplate(
        text=template_in.text, notes=template_in.notes, user_id=user.id
    )
    print(new_template, '@@@@@')
    db.add(new_template)
    await db.commit()
    await db.refresh(new_template)

    print(new_template, '@@@@@')
    if template_in.tasks and new_template:
        for task_in in template_in.tasks:
            new_task = TemplateTask(
                text=task_in.text, template_id=new_template.id
            )
            db.add(new_task)

    await db.commit()
    await db.refresh(new_template)

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
    template_in: GoalTemplateUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    template = await get_template_or_404(template_id, user, db)
    for var, value in vars(template_in).items():
        if var not in ("tasks", "notes", "text"):
            continue
        elif var == "tasks":
            for task_in in value:
                if not hasattr(task_in, "id"):
                    task = TemplateTask(
                        **task_in.dict(), template_id=template_id
                    )
                else:
                    task = await get_task_or_404(task_in.id, template_id, db)
                    for task_var, task_value in vars(task_in).items():
                        (
                            setattr(task, task_var, task_value)
                            if task_value
                            else None
                        )
                db.add(task)
        else:
            setattr(template, var, value) if value else None

    for task in template.tasks:
        if hasattr(task, "id"):
            if task.id not in [
                t.id for t in template_in.tasks if hasattr(t, "id")
            ]:
                await db.delete(task)

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
