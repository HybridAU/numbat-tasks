FROM node:21-bookworm-slim

WORKDIR /frontend

COPY ./frontend/package.json .
COPY ./frontend/yarn.lock* .

RUN yarn

COPY ./frontend /frontend

COPY ./docker/frontend/entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]
