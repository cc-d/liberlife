from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status, Depends
from ..db.models import User
from ..db.main import get_db


async def get_user_by_id(
    user_id: int, session: AsyncSession = Depends(get_db)
) -> User:
    result = await session.execute(select(User).filter_by(id=user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user
