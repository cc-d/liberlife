from datetime import datetime as dt
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Body, Query
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.sql import func


from ..crud.goal import (
    get_goal_from_id,
    get_goal_task_from_id,
    new_goal,
    get_user_goals,
)
from ..db import get_adb
from ..db.common import async_addcomref
from ..db.models import Goal, GoalTask, User, GoalTemplate
from ..schemas import goal as GoalSchema, user as UserSchema
from ..utils.dependencies import get_current_user
from ..utils.httperrors import HTTP401, HTTP404, HTTP400, HTTP409


router = APIRouter(prefix='/goals', tags=['goal'])

AUTHUID = int | None | UserSchema.UserOut | str | User


from logfunc import logf


@logf()
def _raise(
    goal: GoalSchema.GoalOut | None, auth_uid: AUTHUID = None
) -> GoalSchema.GoalOut:
    if getattr(auth_uid, "id", None) is not None:
        auth_uid = auth_uid.id
    if goal is None:
        raise HTTP404
    if auth_uid is not None:
        if not isinstance(auth_uid, GoalSchema.UserOut):
            auth_uid = int(auth_uid)
        if int(goal.user_id) != int(auth_uid):
            raise HTTP401
    return goal


@router.post('', response_model=GoalSchema.GoalOut)
async def create_goal(
    newgoal: GoalSchema.GoalIn,
    cur_user: GoalSchema.UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    if newgoal.template_id is not None:
        stmt = select(GoalTemplate).where(
            GoalTemplate.id == newgoal.template_id
        )
        ngtemp = await db.execute(stmt)
        ngtemp = ngtemp.scalars().first()
        if ngtemp is None:
            raise HTTP400(
                'Template for id: {} not found'.format(newgoal.template_id)
            )
        elif ngtemp.user_id != cur_user.id:
            raise HTTP401(
                '%s not authorized %s for tempid %s'
                % (cur_user.id, ngtemp.user_id, newgoal.template_id)
            )

        newtxt = ngtemp.text if newgoal.text is None else newgoal.text

        ngtasks = []
        if ngtemp.tasks:
            ngtasks = [
                GoalSchema.GoalTaskIn(text=t.text) for t in ngtemp.tasks
            ]

        ng = await new_goal(
            newtxt,
            user_id=cur_user.id,
            tasks=ngtasks,
            notes=ngtemp.notes,
            db=db,
        )

    else:
        ng = await new_goal(newgoal.text, user_id=cur_user.id, db=db)
    return ng


@router.get('', response_model=List[GoalSchema.GoalOut])
async def list_goals(
    archived: Optional[bool] = Query(None),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
) -> List[Goal]:

    if archived is None:
        return await get_user_goals(cur_user.id, db=db)
    return await get_user_goals(cur_user.id, db=db, archived=archived)


@router.get("/{goal_id}", response_model=GoalSchema.GoalOut)
async def get_goal(
    goal: Goal = Depends(get_goal_from_id), cur_user=Depends(get_current_user)
):
    return _raise(goal, cur_user)


@router.put("/{goal_id}", response_model=GoalSchema.GoalOut)
async def update_goal(
    goal_update: GoalSchema.GoalUpdate,
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    goal = _raise(goal, cur_user.id)
    for field, value in goal_update.model_dump().items():
        if value is None or field == 'use_todays_date':
            continue
        setattr(goal, field, value)
    await async_addcomref(db, goal)
    return goal


@router.delete("/{goal_id}")
async def delete_goal(
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    _raise(goal, cur_user.id)
    await db.delete(goal)
    await db.commit()
    return {"detail": "Goal deleted successfully"}


@router.put("/{goal_id}/notes", response_model=GoalSchema.GoalOut)
async def update_goal_notes(
    goal_update: GoalSchema.GoalUpdate = Body(...),
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    goal = _raise(goal, cur_user.id)
    goal.notes = goal_update.notes
    await async_addcomref(db, goal)
    return goal


@router.post("/{goal_id}/tasks", response_model=GoalSchema.GoalTaskOut)
async def add_task_to_goal(
    task_in: GoalSchema.GoalTaskIn,
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    # Ensure the goal belongs to the current user
    if goal.user_id != cur_user.id:
        raise HTTP401
    new_task = GoalTask(**task_in.model_dump(), goal_id=goal.id)
    goal.updated_on = func.now()
    db.add(new_task)
    db.add(goal)
    await db.commit()
    await db.refresh(new_task)
    return new_task


@router.get("/{goal_id}/tasks", response_model=List[GoalSchema.GoalTaskOut])
async def list_tasks_for_goal(
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    if goal.user_id != cur_user.id:
        raise HTTP401
    tasks = await db.execute(
        select(GoalTask).where(GoalTask.goal_id == goal.id)
    )
    return tasks.scalars().all()


@router.get(
    "/{goal_id}/tasks/{task_id}", response_model=GoalSchema.GoalTaskOut
)
async def get_task(
    task_id: int,
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):

    if goal is None:
        raise HTTP404
    if goal.user_id != cur_user.id:
        raise HTTP401

    taskmap = {t.id: t for t in goal.tasks}
    if task_id not in taskmap:
        raise HTTP404
    return taskmap[task_id]


@router.put(
    "/{goal_id}/tasks/{task_id}", response_model=GoalSchema.GoalTaskOut
)
async def update_task(
    task: GoalTask = Depends(get_goal_task_from_id),
    goal: Goal = Depends(get_goal_from_id),
    task_update: Optional[GoalSchema.GoalTaskUpdate] = Body(None),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):

    if goal.user_id != cur_user.id:
        raise HTTP401

    if task_update is None:
        task.update_status()
    elif hasattr(task_update, "status") and task_update.status is None:
        task.update_status()
    else:
        task.status = task_update.status

    db.add(task)
    goal.updated_on = func.now()
    db.add(goal)
    await db.commit()
    await db.refresh(task)

    return task


@router.delete("/{goal_id}/tasks/{task_id}")
async def delete_task(
    goal: Goal = Depends(get_goal_from_id),
    task: GoalTask = Depends(get_goal_task_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    try:
        if goal.user_id != cur_user.id:
            raise HTTP401
        goal.updated_on = func.now()
        db.add(goal)
        await db.delete(task)
        await db.commit()
        await db.refresh(goal)

        return {
            "detail": "Task deleted successfully",
            "updated_on": goal.updated_on,
        }
    except NoResultFound:
        # Handle the case where the task is not found
        HTTP404('Task not found')
