#!/bin/bash
pnpm install
if [[ "$DEBUG" == "True" ]]; then
    # start the development server
    pnpm dev --host --port 8000
else
    pnpm run build
    rm -rf /static_files/frontend
    mv /frontend/dist /static_files/frontend
fi
