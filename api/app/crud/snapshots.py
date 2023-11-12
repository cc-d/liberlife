from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import func
from ..schemas import snapshot as SnapSchema
from ..db.models import (
    BoardSnapshot,
    SnapshotGoal,
    SnapshotGoalTask,
    Goal,
    GoalTask,
)


async def get_snapshot_from_uuid(
    uuid: str, db: AsyncSession
) -> BoardSnapshot | None:
    snap = await db.execute(
        select(BoardSnapshot)
        .filter(BoardSnapshot.uuid == uuid)
        .options(
            joinedload(BoardSnapshot.goals).options(
                joinedload(SnapshotGoal.tasks)
            )
        )
    )
    return snap.unique().scalar_one_or_none()
