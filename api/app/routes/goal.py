from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from ..schemas import goal as GoalSchema
from ..db import get_adb
from ..db.models import Goal
from ..utils.dependencies import get_current_user
from ..db.common import async_addcomref

router = APIRouter(prefix='/goals', tags=['goal'])


@router.post("/", response_model=GoalSchema.GoalOut)
async def create_goal(
    goal: GoalSchema.GoalIn,
    cur_user: GoalSchema.UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    new_goal = Goal(**goal.model_dump(), user_id=cur_user.id)
    await async_addcomref(db, new_goal)
    return new_goal


@router.get("/", response_model=List[GoalSchema.GoalOut])
async def list_goals(
    cur_user=Depends(get_current_user), db: AsyncSession = Depends(get_adb)
):
    goals = await db.execute(select(Goal).where(Goal.user_id == cur_user.id))
    goals = goals.scalars().all()
    return goals
