from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
import logging
from logfunc import logf
from ..db import get_adb
from ..db.models import GoalTemplate, TemplateTask, User
from ..schemas.goal import (
    GoalTemplateDB,
    TemplateTaskDB,
    GoalTemplateIn,
    TemplateTaskUpdate,
    GoalTemplateUpdate,
    TemplateTaskIn,
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
    await async_addcomref(db, new_template)

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


@logf()
@router.put("/templates/{template_id}", response_model=GoalTemplateDB)
async def update_goal_template(
    template_id: int,
    template_in: GoalTemplateUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    template = await get_template_or_404(template_id, user, db)
    updated = False  # Initialize the update flag

    # Update template attributes
    for _attr in ("text", "notes", "use_todays_date"):
        if hasattr(template_in, _attr) and getattr(template, _attr) != getattr(
            template_in, _attr
        ):
            setattr(template, _attr, getattr(template_in, _attr))
            updated = True

    del_task_ids = []
    task_in_ids = [t.id for t in template_in.tasks]
    for _task in template.tasks:
        if _task.id not in task_in_ids:
            del_task_ids.append(_task.id)
            updated = True

    if del_task_ids:
        logging.debug("deleting tasks: %s", del_task_ids)
        await db.execute(
            TemplateTask.__table__.delete().where(
                TemplateTask.id.in_(del_task_ids)
            )
        )

    for _ttask in template_in.tasks:
        if not hasattr(_ttask, "id") or _ttask.id is None:
            logging.debug(
                "no id creating new task: %s %s", _ttask, template_id
            )
            new_task = TemplateTask(text=_ttask.text, template_id=template_id)
            db.add(new_task)
            updated = True

    # Commit changes if any updates were made
    if updated:
        await db.commit()
        await db.refresh(template)

    return template  # Assuming this is the desired response


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
