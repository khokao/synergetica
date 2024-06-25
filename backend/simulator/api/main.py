from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from common.unify_logging_fastapi import setup_logging
from simulator.api.routers import router
import numpy as np

app = FastAPI()


origins = [
    "http://localhost:3000",  # Reactアプリが実行されているURLを追加
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/healthcheck_simulator', include_in_schema=False)
async def healthcheck() -> dict[str, str]:
    return {'status': 'ok'}


app.include_router(router)

setup_logging()

if __name__=="__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0",port=8008)
