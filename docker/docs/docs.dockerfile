FROM python:3.14-slim-trixie

ENV UV_PROJECT_ENVIRONMENT=/venv
ENV DEBUG=False

WORKDIR /docs

RUN pip install uv

COPY ./docs/pyproject.toml .
COPY ./docs/uv.lock* .


RUN uv sync

COPY ./docs /docs

COPY ./docker/docs/entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]
