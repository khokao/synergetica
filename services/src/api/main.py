from fastapi import FastAPI

from api.generator import router as generator_router
from api.simulator import router as simulator_router
from api.utils import RequestCancelledMiddleware, setup_logging

app = FastAPI()
app.add_middleware(RequestCancelledMiddleware)


@app.get('/healthcheck', include_in_schema=False)
async def healthcheck() -> dict[str, str]:
    return {'status': 'ok'}


app.include_router(generator_router.router)
app.include_router(simulator_router.router)

setup_logging()
