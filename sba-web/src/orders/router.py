from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy import insert, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_async_session

from auth.models import User
from auth.base_config import current_user

from orders.models import order
from orders.processor import parse_pdf, parse_csv

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
        query = select(order).where(order.c.user_id == user.id and order.c.date.between(start_date, end_date))
        result = await session.execute(query)
        return {
            "status": 200,
            "data": [i._asdict() for i in result.all()],
            "details": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/pie-column")
async def get_pie_column(
        start_date: date = date.min,
        end_date: date = date.max,
        user: User = Depends(current_user),
        session: AsyncSession = Depends(get_async_session)
):
    try:
        pie_query = select(order.c.type, func.sum(order.c.amount)).where(order.c.user_id == user.id and order.c.date.between(start_date, end_date)).group_by(order.c.type)
        column_query = select(order.c.date, func.sum(order.c.amount)).where(order.c.user_id == user.id and order.c.date.between(start_date, end_date)).group_by(order.c.date)
        pie_result = await session.execute(pie_query)
        column_result = await session.execute(column_query)
        return {
            "status": 200,
            "data": {
                "pie": [i._asdict() for i in pie_result.all()],
                "column": [i._asdict() for i in column_result.all()]
            },
            "details": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
async def post_orders(
    file: UploadFile,
    user: User = Depends(current_user),
    session: AsyncSession = Depends(get_async_session)
):
    try:
        if file.filename.endswith(".pdf"):
            data = parse_pdf(file.file, user)
        elif file.filename.endswith(".csv"):
            data = parse_csv(file.file, user)
        else:
            return {
                "status": 400,
                "data": None,
                "details": None
            }

        if data is None:
            return {
                "status": 400,
                "data": None,
                "details": None
            }

        stmt = insert(order).values(data)
        await session.execute(stmt)
        await session.commit()
        return {
            "status": 200,
            "data": None,
            "details": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
