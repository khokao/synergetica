from fastapi import FastAPI

from common.unify_logging_fastapi import setup_logging
from generator.api.routers import router

app = FastAPI()


@app.get('/healthcheck_simulator', include_in_schema=False)
async def healthcheck() -> dict[str, str]:
    return {'status': 'ok'}


app.include_router(router)

setup_logging()
