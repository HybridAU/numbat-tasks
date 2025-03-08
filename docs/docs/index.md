# Numbat Tasks

A self-hosted to do list app

## Getting started

The recommended way to get set up is with [docker compose](https://docs.docker.com/compose/). At least some level of
familiarity with docker compose and self-hosting is assumed.

This guide is for running on <http://localhost:8000> behind a reverse proxy. However, it should be easy to adapt to
serving the files directly with [Caddy](https://caddyserver.com/).

To get started there are 3 files needed:

* [docker-compose.yml](#docker-composeyml)
* [.env](#env)
* [Caddyfile](#caddyfile)

### docker-compose.yml

The main file to specify which docker containers to run. Once set up, this file shouldn't need to change for releases.

``` yaml title="docker-compose.yml"
name: numbat-tasks # (1)!

services:
    api:
        image: ghcr.io/hybridau/numbat-tasks-api:$VERSION
        env_file:
            - .env
        depends_on:
            database:
                condition: service_started
        volumes:
            - static_files:/static_files
        restart: always
    database:
        image: postgres:16-bookworm
        volumes:
            - postgres_data:/var/lib/postgresql/data/
        env_file:
            - .env
        restart: always
    frontend: # (2)!
        image: ghcr.io/hybridau/numbat-tasks-frontend:$VERSION
        volumes:
          - static_files:/static_files
        env_file:
            - .env
    caddy:
        image: caddy:2-alpine
        ports: # (3)!
            - "127.0.0.1:8000:80" 
        volumes:
            - ./Caddyfile:/etc/caddy/Caddyfile:ro
            - caddy_data:/data
            - caddy_config:/config
            - static_files:/static_files:ro
        restart: always

volumes:
    postgres_data:
    caddy_data:
    caddy_config:
    static_files:
```

1. This is used to keep all the containers and volumes in their own spaces, so you can have a different project with
   a volume called `postgres_data` and it won't conflict with this one.
2. The frontend docker container will start, build the static files, write them out to `/static_files/frontend` and then
   exit. Caddy will continue to serve the files.
3. To serve the site directly rather than behind a reverse proxy, change this to
   ```yaml
   ports:
     - "80:80" 
     - "443:443" 
   ```

### .env

All the settings should live in here. The following is the minimum configuration, but a list of [all environment
variables](./environment_variables.md) is available.

``` title=".env"
VERSION=0.4.0
# Reasonable defaults
POSTGRES_DB=numbat_tasks
POSTGRES_USER=numbat

# Must be changed for prod
ALLOWED_HOSTS=tasks.example.com
# echo POSTGRES_PASSWORD=$(dd if=/dev/urandom bs=1 count=18 status=none | base64) >> .env
# echo SECRET_KEY=$(dd if=/dev/urandom bs=1 count=42 status=none | base64) >> .env
```

### Caddyfile

```json title="Caddyfile"
:80 { // (1)!
    handle_path /api/static/* {
    	root * /static_files/api
        file_server
    }
    handle /api/* {
    	reverse_proxy api:8000
    }
    handle {
	    root * /static_files/frontend
	    try_files {path} /index.html
	    file_server
    }
}
```

1. To serve the site directly, change this to 
   ```
   tasks.example.com {
      ...
   ```

### Running
Place those three files in the same directory and to start the site run
```shell
docker compose up -d
```

User managment is still on the to do list, so for now to create a user run
```shell
docker compose exec -it api /venv/bin/python /api/manage.py createsuperuser
```


## Delete everything and start again

!!! warning
    This will permanently delete everything. All users, all lists, all tasks, everything.

```shell
docker compose down --volumes
```