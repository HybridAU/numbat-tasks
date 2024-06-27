FROM node:22-bookworm-slim

WORKDIR /frontend

COPY ./frontend/package.json .
COPY ./frontend/pnpm-lock.yaml* .

RUN corepack enable
RUN pnpm install

COPY ./frontend /frontend

COPY ./docker/frontend/entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]
