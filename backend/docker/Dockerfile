# requirements-stage
FROM python:3.12-slim as requirement-stage

WORKDIR /tmp

RUN pip install poetry 

COPY ./pyproject.toml ./poetry.lock /tmp/

RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

# build-stage
FROM python:3.12-slim
WORKDIR /app

RUN addgroup --system --gid 1001 python
RUN adduser --system --uid 1001 api

COPY --from=requirement-stage /tmp/requirements.txt /app/requirements.txt
COPY ./generator /app/generator
COPY ./simulator /app/simulator
COPY ./datasets /app/datasets
COPY ./common /app/common

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

EXPOSE 8080 8000

USER api

