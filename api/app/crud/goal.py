from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from logfunc import logf
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from typing import Optional, Union

from ..db import get_adb
from ..db.models import User, Goal, GoalTask
from ..schemas.user import UserDB


async def get_goal_from_id(
    goal_id: int, db: AsyncSession = Depends(get_adb)
) -> Optional[Goal]:
    goal = await db.execute(select(Goal).where(Goal.id == goal_id))
    goal = goal.scalar_one_or_none()
    return goal


async def get_goal_task_from_id(
    task_id: int, db: AsyncSession = Depends(get_adb)
) -> Optional[Goal]:
    goal_task = await db.execute(select(GoalTask).where(GoalTask.id == task_id))
    goal_task = goal_task.scalar_one_or_none()
    return goal_task
