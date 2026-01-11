FROM python:3.14-slim-trixie

ENV UV_PROJECT_ENVIRONMENT=/venv
ENV DEBUG=False

WORKDIR /api

RUN pip install uv

COPY ./api/pyproject.toml .
COPY ./api/uv.lock* .

RUN uv sync --group production --no-group dev

COPY ./api /api

COPY ./docker/api/entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]
