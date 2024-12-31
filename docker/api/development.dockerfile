FROM python:3.13-slim-bookworm

WORKDIR /api

RUN pip install poetry

COPY ./api/pyproject.toml .
COPY ./api/poetry.lock* .

RUN poetry install --no-root

COPY ./api /api

COPY ./docker/api/entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]
