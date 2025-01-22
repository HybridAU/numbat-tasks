FROM python:3.13-slim-bookworm

WORKDIR /docs

RUN pip install uv

COPY ./docs/pyproject.toml .
COPY ./docs/uv.lock* .

RUN UV_PROJECT_ENVIRONMENT=/venv uv sync

COPY ./docs /docs

COPY ./docker/docs/entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]
