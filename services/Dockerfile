FROM python:3.12-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=never \
    UV_PYTHON=python3.12 \
    UV_PROJECT_ENVIRONMENT=/app

COPY . /build

RUN uvx --from "huggingface_hub[cli]" huggingface-cli download \
    khokao/synergetica \
    base.ckpt \
    --local-dir /build/src/api/generator/checkpoints

RUN --mount=type=cache,target=/root/.cache \
    cd /build && uv sync --locked --no-dev --no-editable

FROM python:3.12-slim

RUN groupadd -r app && useradd -r -d /app -g app -N app

COPY --from=builder --chown=app:app /app /app

USER app
WORKDIR /app

CMD ["/app/bin/uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "7007"]
