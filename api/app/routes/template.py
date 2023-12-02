from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_adb
from ..db.models import GoalTemplate, TemplateTask, User
from ..schemas.goal import GoalTemplateBase, TemplateTaskBase
from ..utils.httperrors import HTTP404, HTTP409, HTTP401, HTTP400
from ..utils.dependencies import get_current_user

router = APIRouter()


async def get_template_or_404(
    template_id: int, user: User, db: Session = Depends(get_adb)
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
    task_id: int, template_id: int, db: Session = Depends(get_adb)
) -> TemplateTask:
    task = (
        db.query(TemplateTask)
        .filter(
            TemplateTask.id == task_id, TemplateTask.template_id == template_id
        )
        .first()
    )
    if task is None:
        raise HTTP404(detail="Task not found")
    return task


# ... existing imports and functions ...


@router.post("/templates", response_model=GoalTemplateBase)
async def create_goal_template(
    template_in: GoalTemplateBase,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_adb),
):
    new_template = GoalTemplate(**template_in.dict(), user_id=user.id)
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    return new_template


@router.get("/templates", response_model=List[GoalTemplateBase])
async def list_goal_templates(
    user: User = Depends(get_current_user), db: Session = Depends(get_adb)
):
    return db.query(GoalTemplate).filter(GoalTemplate.user_id == user.id).all()


@router.get("/templates/{template_id}", response_model=GoalTemplateBase)
async def get_goal_template(
    template_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_adb),
):
    return await get_template_or_404(template_id, user, db)


@router.put("/templates/{template_id}", response_model=GoalTemplateBase)
async def update_goal_template(
    template_id: int,
    template_in: GoalTemplateBase,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_adb),
):
    template = await get_template_or_404(template_id, user, db)
    for var, value in vars(template_in).items():
        setattr(template, var, value) if value else None
    db.commit()
    db.refresh(template)
    return template


@router.delete(
    "/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_goal_template(
    template_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_adb),
):
    template = await get_template_or_404(template_id, user, db)
    db.delete(template)
    db.commit()
    return {"detail": "Template deleted successfully"}


@router.post("/templates/{template_id}/tasks", response_model=TemplateTaskBase)
async def add_task_to_template(
    template_id: int,
    task_in: TemplateTaskBase,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_adb),
):
    await get_template_or_404(template_id, user, db)
    task = TemplateTask(**task_in.dict(), template_id=template_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get(
    "/templates/{template_id}/tasks", response_model=List[TemplateTaskBase]
)
async def list_tasks_in_template(
    template_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_adb),
):
    await get_template_or_404(template_id, user, db)
    return (
        db.query(TemplateTask)
        .filter(TemplateTask.template_id == template_id)
        .all()
    )


@router.put(
    "/templates/{template_id}/tasks/{task_id}", response_model=TemplateTaskBase
)
async def update_task_in_template(
    template_id: int,
    task_id: int,
    task_in: TemplateTaskBase,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_adb),
):
    await get_template_or_404(template_id, user, db)
    task = await get_task_or_404(task_id, template_id, db)
    for var, value in vars(task_in).items():
        setattr(task, var, value) if value else None
    db.commit()
    db.refresh(task)
    return task


@router.delete(
    "/templates/{template_id}/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_task_from_template(
    template_id: int,
    task_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_adb),
):
    await get_template_or_404(template_id, user, db)
    task = await get_task_or_404(task_id, template_id, db)
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted successfully"}
