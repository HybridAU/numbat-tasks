# Based on the uv best practice example for docker images
# https://github.com/astral-sh/uv-docker-example/blob/e791995e0bc1edab8caef7205b8801ced07f1acd/Dockerfile
# Use a Python image with uv pre-installed
FROM ghcr.io/astral-sh/uv:python3.14-trixie-slim

# Setup a non-root user
RUN groupadd --system --gid 999 nonroot \
 && useradd --system --gid 999 --uid 999 --create-home nonroot

# Install the project into `/api`
WORKDIR /api

# Default debug to False, it can be change to true in .env files
ENV DEBUG=False

# Set the virtual environment path to be outside the /api directory
# that way we don't get conflicts in development with the .venv
ENV UV_PROJECT_ENVIRONMENT=/venv

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

# Omit development dependencies
# They will get installed if started in development mode,
# but shouldn't form part of the base image
ENV UV_NO_DEV=1

# Ensure installed tools can be executed out of the box
ENV UV_TOOL_BIN_DIR=/usr/local/bin

# Install the project's dependencies using the lockfile and settings
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=api/uv.lock,target=uv.lock \
    --mount=type=bind,source=api/pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project

# Then, add the rest of the project source code and install it
# Installing separately from its dependencies allows optimal layer caching
COPY ./api /api

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked \
    --group production --no-group dev

# Place executables in the environment at the front of the path
ENV PATH="/venv/bin:$PATH"

# Reset the entrypoint, don't invoke `uv`
ENTRYPOINT []

# Copy entry point script and make it executable
COPY ./docker/api/entry.sh /entry.sh
RUN chmod +x /entry.sh

# Use the non-root user to run our application
USER nonroot

CMD ["/entry.sh"]
