#!/bin/bash
if [[ "$DEBUG" == "True" ]]; then
    # Reinstall dependencies (these might change during development)
    pnpm install --config.confirmModulesPurge=false
    # start the development server
    pnpm dev --host --port 8000
else
    pnpm run build
    rm -rf /static_files/frontend
    mv /frontend/dist /static_files/frontend
fi
