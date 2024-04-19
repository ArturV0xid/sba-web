from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from pages.router import router as router_pages

from orders.router import router as router_orders

from auth.base_config import auth_backend, fastapi_users
from auth.schemas import UserRead, UserCreate


app = FastAPI(
    title="SmartBank Analytics"
)


app.mount("/staic", StaticFiles(directory="src/static"), name="static")


#pages routers
app.include_router(router_pages)


#orders routers
app.include_router(router_orders)


#auth routers
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["Auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["Auth"],
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)