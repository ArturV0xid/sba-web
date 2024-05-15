from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from pages.router import router as router_pages
from orders.router import router as router_orders
from auth.base_config import auth_backend, fastapi_users
from auth.schemas import UserRead, UserCreate, UserUpdate

import warnings

warnings.filterwarnings("ignore")

app = FastAPI(title="SmartBank Analytics")


app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(router_pages)

app.include_router(router_orders)

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

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/auth",
    tags=["Auth"],
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
