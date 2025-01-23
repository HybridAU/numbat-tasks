FROM node:22-bookworm-slim

ENV VITE_API_BASE_URL=/api
ENV DEBUG=False

WORKDIR /frontend

COPY ./frontend/package.json .
COPY ./frontend/pnpm-lock.yaml* .

RUN corepack enable
RUN pnpm install

COPY ./frontend /frontend

COPY ./docker/frontend/entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]
