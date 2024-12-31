from fastapi import FastAPI

from api.generator import router as generator_router
from api.routers import simulator
from api.utils import RequestCancelledMiddleware, setup_logging

app = FastAPI()
app.add_middleware(RequestCancelledMiddleware)


@app.get('/healthcheck', include_in_schema=False)
async def healthcheck() -> dict[str, str]:
    return {'status': 'ok'}


app.include_router(generator_router.router)
app.include_router(simulator.router)

setup_logging()
