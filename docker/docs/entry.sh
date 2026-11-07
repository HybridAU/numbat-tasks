#!/bin/bash
cd /docs
if [[ "$DEBUG" == "True" ]]; then
    uv sync
    uv run zensical serve
else
    /venv/bin/zensical build
    rm -rf /static_files/docs
    mv /docs/site /static_files/docs
fi
