from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload, selectinload

from ..crud.goal import get_goal_from_id, get_goal_task_from_id
from ..db import get_adb
from ..db.common import async_addcomref
from ..db.models import Goal, GoalTask
from ..schemas import goal as GoalSchema, user as UserSchema
from ..utils.dependencies import get_current_user

router = APIRouter(prefix='/goals', tags=['goal'])


@router.post('', response_model=GoalSchema.GoalOut)
async def create_goal(
    goal: GoalSchema.GoalIn,
    cur_user: GoalSchema.UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    new_goal = Goal(text=goal.text, user_id=cur_user.id, user=cur_user)
    await async_addcomref(db, new_goal)
    return GoalSchema.GoalOut(
        **new_goal.__dict__, user=UserSchema.UserOut(**cur_user.__dict__)
    )


@router.get('', response_model=List[GoalSchema.GoalOut])
async def list_goals(
    cur_user=Depends(get_current_user), db: AsyncSession = Depends(get_adb)
):
    goals = await db.execute(
        select(Goal).distinct().where(Goal.user_id == cur_user.id)
    )
    goals = goals.unique().scalars().all()
    return goals


@router.get("/{goal_id}", response_model=GoalSchema.GoalOut)
async def get_goal(
    goal: Goal = Depends(get_goal_from_id), cur_user=Depends(get_current_user)
):
    if goal.user_id != cur_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to access this goal.",
        )
    return goal


@router.put("/{goal_id}", response_model=GoalSchema.GoalOut)
async def update_goal(
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    goal_in: GoalSchema.GoalIn = Body(...),
    db: AsyncSession = Depends(get_adb),
):
    if goal.user_id != cur_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to access this goal.",
        )
    for field, value in goal_in:
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to delete this goal.",
        )
    await db.delete(goal)
    await db.commit()
    return {"detail": "Goal deleted successfully"}


@router.put("/{goal_id}/notes", response_model=GoalSchema.GoalOut)
async def update_goal_notes(
    goal_update: GoalSchema.GoalUpdateNotes,
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    if goal.user_id != cur_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to update this goal.",
        )
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to add tasks to this goal.",
        )
    new_task = GoalTask(**task_in.model_dump(), goal_id=goal.id)
    await async_addcomref(db, new_task)
    return new_task


@router.get("/{goal_id}/tasks", response_model=List[GoalSchema.GoalTaskOut])
async def list_tasks_for_goal(
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    if goal.user_id != cur_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to view tasks for this goal.",
        )
    tasks = await db.execute(
        select(GoalTask).where(GoalTask.goal_id == goal.id)
    )
    return tasks.scalars().all()


@router.get("/{goal_id}/tasks/{task_id}", response_model=GoalSchema.GoalTaskOut)
async def get_task(
    task: GoalTask = Depends(
        get_goal_task_from_id
    ),  # You'll need to implement this
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
):
    if task.goal_id != goal.id or goal.user_id != cur_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to access this task.",
        )
    return task


@router.put("/{goal_id}/tasks/{task_id}", response_model=GoalSchema.GoalTaskOut)
async def update_task(
    task_update: GoalSchema.GoalTaskUpdate,
    task: GoalTask = Depends(
        get_goal_task_from_id
    ),  # You'll need to implement this
    goal: Goal = Depends(get_goal_from_id),
    cur_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    if task.goal_id != goal.id or goal.user_id != cur_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to update this task.",
        )
    for key, value in task_update.dict().items():
        setattr(task, key, value)
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
    if task.goal_id != goal.id or goal.user_id != cur_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to delete this task.",
        )
    await db.delete(task)
    await db.commit()

    # Fetch the updated goal's timestamp after the task deletion
    updated_goal = await db.execute(select(Goal).filter(Goal.id == goal.id))
    updated_goal = updated_goal.scalar()

    # Return the success detail alongside the updated_on timestamp
    return {
        "detail": "Task deleted successfully",
        "updated_on": updated_goal.updated_on,
    }