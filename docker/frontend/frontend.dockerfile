FROM node:25-trixie-slim

ENV VITE_API_BASE_URL=""
ENV DEBUG=False

WORKDIR /frontend

COPY ./frontend/package.json .
COPY ./frontend/pnpm-lock.yaml* .
COPY ./frontend/pnpm-workspace.yaml* .

RUN npm install -g pnpm
RUN pnpm install

COPY ./frontend /frontend

COPY ./docker/frontend/entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]
