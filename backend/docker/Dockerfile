# requirements-stage
FROM python:3.12-slim as build

WORKDIR /tmp

RUN pip install --upgrade pip && pip install poetry 

COPY ./pyproject.toml ./poetry.lock /tmp/

RUN poetry config virtualenvs.create false &&\
    poetry install --only main &&\
    rm -rf ~/.cache

# build-stage
FROM python:3.12-slim as app
WORKDIR /app

COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=build /usr/local/bin /usr/local/bin

COPY ./generator /app/generator 
COPY ./simulator /app/simulator
COPY ./datasets /app/datasets
COPY ./common /app/common

EXPOSE 8080 8000


