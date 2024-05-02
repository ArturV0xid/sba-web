from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_async_session

from auth.models import User
from auth.base_config import current_user

from orders.models import order
from orders.processor import parse_pdf

from datetime import date

router = APIRouter(
    prefix="/orders",
    tags=["Order"]
)


@router.get("")
async def get_orders(
        start_date: date = date.min,
        end_date: date = date.max,
        user: User = Depends(current_user),
        session: AsyncSession = Depends(get_async_session)
):
    try:
        query = select(order).where(order.c.user_id == user.id).where(order.c.date.between(start_date, end_date))
        result = await session.execute(query)
        return {
            "status": 200,
            "data": [data._asdict() for data in result.all()],
            "details": None
        }
    except Exception:
        raise HTTPException(status_code=500)


@router.post("/upload-file")
async def post_orders(
    file: UploadFile,
    user: User = Depends(current_user),
    session: AsyncSession = Depends(get_async_session)
):
    try:
        df = await parse_pdf(file.file, user, "BNB")
        stmt = insert(order).values(df.to_dict("records"))
        await session.execute(stmt)
        await session.commit()
        return {
            "status": 200,
            "data": None,
            "details": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
