from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas import snapshot as SnapSchema
from ..schemas import user as UserSchema

from ..utils.dependencies import get_current_user
from ..db import get_adb
from ..db.models import (
    BoardSnapshot,
    SnapshotGoal,
    SnapshotGoalTask,
    Goal,
    GoalTask,
)
from ..db.common import async_addcomref
from ..crud.goal import get_goal_from_id, get_user_goals, new_goal
from ..crud.snapshots import get_snapshot_from_uuid as get_snap_from_uuid

router = APIRouter(prefix='/snapshots', tags=['snapshot'])


@router.post('', response_model=SnapSchema.SnapshotOut)
async def create_snapshot(
    curuser: UserSchema.UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    new_snap = BoardSnapshot(user_id=curuser.id)
    new_goals = await get_user_goals(curuser.id, db=db)
    new_snapgoals = []
    for ng in new_goals:
        newsg = SnapshotGoal(
            user_id=curuser.id,
            text=ng.text,
            notes=ng.notes,
            archived=ng.archived,
        )
        newsg.tasks = [
            SnapshotGoalTask(text=nt.text, completed=nt.completed)
            for nt in ng.tasks
        ]
        new_snapgoals.append(newsg)
    new_snap.goals = new_snapgoals
    await async_addcomref(db, new_snap)
    return (
        (
            await db.execute(
                select(BoardSnapshot)
                .filter(BoardSnapshot.uuid == new_snap.uuid)
                .options(
                    joinedload(BoardSnapshot.goals).options(
                        joinedload(SnapshotGoal.tasks)
                    )
                )
            )
        )
        .unique()
        .scalar_one_or_none()
    )


@router.get('', response_model=list[SnapSchema.SnapshotOut])
async def list_snapshots(
    curuser: SnapSchema.UserOut = Depends(get_current_user),
    db: AsyncSession = Depends(get_adb),
):
    return (
        await db.execute(
            select(BoardSnapshot).filter(BoardSnapshot.user_id == curuser.id)
        )
        .scalars()
        .all()
    )


@router.get('/{snap_id}', response_model=SnapSchema.SnapshotOut)
async def get_snapshot(snap_id: str, db: AsyncSession = Depends(get_adb)):
    return await get_snap_from_uuid(snap_id, db=db)
