FROM python:3.13-slim-bookworm

WORKDIR /api

RUN pip install uv

COPY ./api/pyproject.toml .
COPY ./api/uv.lock* .

RUN UV_PROJECT_ENVIRONMENT=/venv uv sync --group production --no-group dev

COPY ./api /api

COPY ./docker/api/entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]
