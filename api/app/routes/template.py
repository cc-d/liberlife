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
    use_todays_date = (
        template_in.use_todays_date
        if hasattr(template_in, "use_todays_date")
        else False
    )

    new_template = GoalTemplate(
        text=template_in.text,
        notes=template_in.notes,
        user_id=user.id,
        use_todays_date=use_todays_date,
    )
    db.add(new_template)
    await db.commit()
    await db.refresh(new_template)

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
    for _attr in ['tasks', 'use_todays_date', 'notes', 'text']:
        if (
            hasattr(template_in, _attr)
            and getattr(template_in, _attr) is not None
        ):
            if _attr == 'tasks':
                for task_in in getattr(template_in, _attr):
                    if hasattr(task_in, 'id'):
                        task = await get_task_or_404(
                            task_in.id, template_id, db
                        )
                        task.text = task_in.text
                    else:
                        new_task = TemplateTask(
                            text=task_in.text, template_id=template_id
                        )
                        db.add(new_task)
            else:
                setattr(template, _attr, getattr(template_in, _attr))
            print(_attr, getattr(template_in, _attr), 'getattr')

    await async_addcomref(db, template)

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
