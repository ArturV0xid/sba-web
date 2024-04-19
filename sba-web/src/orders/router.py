from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_async_session

from auth.models import User
from auth.base_config import current_user

from orders.models import order

from datetime import datetime

router = APIRouter(
    prefix="/orders",
    tags=["Order"]
)


@router.get("")
async def get_orders(
        start_date: datetime = datetime.min,
        end_date: datetime = datetime.max,
        user: User = Depends(current_user),
        session: AsyncSession = Depends(get_async_session),
):
    try:
        query = select(order).where(order.c.user_id == user.id).where(order.c.date.between(start_date, end_date))
        result = await session.execute(query)
        return {
            "status": "success",
            "data": [data._asdict() for data in result.all()],
            "details": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "status": "error",
            "data": None,
            "details": str(e)
        })