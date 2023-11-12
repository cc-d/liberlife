from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Body
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
from ..db.models import Goal, GoalTask
from ..schemas import goal as GoalSchema, user as UserSchema
from ..utils.dependencies import get_current_user
from ..utils.httperrors import HTTP401

router = APIRouter(prefix='/goals', tags=['goal'])


@router.post('', response_model=GoalSchema.GoalOut)
async def create_goal(
    newgoal: GoalSchema.GoalIn,
    cur_user: GoalSchema.UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    ng = await new_goal(newgoal.text, user_id=cur_user.id, db=db)
    return ng


@router.get('', response_model=List[GoalSchema.GoalOut])
async def list_goals(
    cur_user=Depends(get_current_user), db: AsyncSession = Depends(get_adb)
) -> List[Goal]:
    return await get_user_goals(cur_user.id, db=db)


@router.get("/{goal_id}", response_model=GoalSchema.GoalOut)
async def get_goal(
    goal: Goal = Depends(get_goal_from_id), cur_user=Depends(get_current_user)
):
    if goal.user_id != cur_user.id:
        raise HTTP401
    return goal


@router.put("/{goal_id}", response_model=GoalSchema.GoalOut)
async def update_goal(
    goal_update: GoalSchema.GoalUpdate,
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    if goal.user_id != cur_user.id:
        raise HTTP401

    for field, value in goal_update.model_dump().items():
        if value is None:
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
    if goal.user_id != cur_user.id:
        raise HTTP401
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
    if goal.user_id != cur_user.id:
        raise HTTP401
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
    task: GoalTask = Depends(
        get_goal_task_from_id
    ),  # You'll need to implement this
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
):
    if goal.user_id != cur_user.id:
        raise HTTP401
    return task


@router.put(
    "/{goal_id}/tasks/{task_id}", response_model=GoalSchema.GoalTaskOut
)
async def update_task(
    task_update: GoalSchema.GoalTaskUpdate,
    task: GoalTask = Depends(
        get_goal_task_from_id
    ),  # You'll need to implement this
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    if goal.user_id != cur_user.id:
        raise HTTP401

    for key, value in task_update.model_dump().items():
        setattr(task, key, value)
    db.add(task)
    goal.updated_on = func.now()
    db.add(goal)
    await db.commit()
    await db.refresh(task)

    return task


@router.delete("/{goal_id}/tasks/{task_id}")
async def delete_task(
    task: GoalTask = Depends(
        get_goal_task_from_id
    ),  # You'll need to implement this
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    if goal.user_id != cur_user.id:
        raise HTTP401
    goal.updated_on = func.now()
    db.add(goal)
    await db.delete(task)
    await db.commit()
    await db.refresh(goal)

    # Return the success detail alongside the updated_on timestamp
    return {
        "detail": "Task deleted successfully",
        "updated_on": goal.updated_on,
    }
