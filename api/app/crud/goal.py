from jwt import PyJWTError
from fastapi import Depends, HTTPException, status, Body, Query
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
from ..utils.httperrors import HTTP401, HTTP404, HTTP400, HTTP409
from logfunc import logf


@logf()
async def get_goal_from_id(
    goal_id: int | str, db: AsyncSession = Depends(get_adb)
) -> Optional[Goal]:

    if isinstance(goal_id, str):
        goal_id = int(goal_id)
    goal = await db.execute(
        select(Goal)
        .where(Goal.id == goal_id)
        .options(selectinload(Goal.tasks))
    )
    return goal.unique().scalar_one_or_none()


async def get_user_goals(
    user_id: int,
    db: AsyncSession = Depends(get_adb),
    archived: Optional[bool] = None,
) -> list[Goal]:
    stmt = select(Goal).where(Goal.user_id == user_id)

    if archived is not None:
        stmt = stmt.where(Goal.archived == archived)

    goals = await db.execute(stmt.options(selectinload(Goal.tasks)))

    return goals.unique().scalars().all()


@logf()
async def get_goal_task_from_id(
    task_id: int | str, db: AsyncSession = Depends(get_adb)
) -> Optional[Goal]:
    goal_task = await db.execute(
        select(GoalTask).where(GoalTask.id == int(task_id))
    )
    goal_task = goal_task.scalar_one_or_none()
    return goal_task


async def new_goal(
    text: str, user_id: int, db: AsyncSession = Depends(get_adb)
) -> Goal:
    goal = Goal(text=text, user_id=user_id)
    await async_addcomref(db, goal)

    return goal
