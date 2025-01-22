#!/bin/bash
cd /docs
if [[ "$DEBUG" == "True" ]]; then
    uv sync
    uv run mkdocs serve
else
    /venv/bin/mkdocs build
    rm -rf /static_files/docs
    mv /docs/site /static_files/docs
fi
