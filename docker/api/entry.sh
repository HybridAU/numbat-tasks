#!/bin/bash
cd /api
/venv/bin/python manage.py migrate
if [[ "$DEBUG" == "True" ]]; then
    # Install development packages (e.g. Pytest and ruff) and start the development server
    uv sync
    uv run python manage.py runserver 0.0.0.0:8000
else
    /venv/bin/python manage.py collectstatic --noinput
    /venv/bin/gunicorn numbat_tasks_api.wsgi --bind 0.0.0.0:8000
fi
