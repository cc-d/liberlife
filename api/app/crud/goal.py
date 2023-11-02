from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from logfunc import logf
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from typing import Optional, Union

from ..db import get_adb
from ..db.models import User, Goal, GoalTask
from ..schemas.user import UserDB
from ..schemas.goal import GoalOut, GoalIn
from ..utils.security import decode_jwt, oauth_scheme, verify_pass, encode_jwt
from ..db.common import async_addcomref


async def get_goal_from_id(
    goal_id: int, db: AsyncSession = Depends(get_adb)
) -> Optional[Goal]:
    return await get_goal_w_tasks(goal_id, db=db)


async def get_goal_w_tasks(
    goal_id: Optional[int], db: AsyncSession = Depends(get_adb)
) -> list[Goal] | Goal:
    if goal_id is None:
        # all
        goal = await db.execute(select(Goal).options(selectinload(Goal.tasks)))
        return goal.scalars().all()
    else:
        goal = await db.execute(
            select(Goal)
            .where(Goal.id == goal_id)
            .options(selectinload(Goal.tasks))
        )
        return goal.scalar_one_or_none()


async def get_goal_task_from_id(
    task_id: int, db: AsyncSession = Depends(get_adb)
) -> Optional[Goal]:
    goal_task = await db.execute(select(GoalTask).where(GoalTask.id == task_id))
    goal_task = goal_task.scalar_one_or_none()
    return goal_task


async def new_goal(
    text: str, user_id: int, db: AsyncSession = Depends(get_adb)
) -> Goal:
    goal = Goal(text=text, user_id=user_id)
    await async_addcomref(db, goal)

    return goal
