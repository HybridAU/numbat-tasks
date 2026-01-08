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
        image: postgres:18-trixie
        volumes:
            - postgres_data:/var/lib/postgresql/
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

```shell title=".env"
VERSION=latest  # (1)! 


# Reasonable defaults
POSTGRES_DB=numbat_tasks
POSTGRES_USER=numbat

# Must be changed for prod
ALLOWED_HOSTS=tasks.example.com
# echo POSTGRES_PASSWORD=$(dd if=/dev/urandom bs=1 count=18 status=none | base64) >> .env
# echo SECRET_KEY=$(dd if=/dev/urandom bs=1 count=42 status=none | base64) >> .env
```

1. You can also pin to a specific version number e.g. `VERSION=1.2.3`


### Caddyfile

```yaml title="Caddyfile"
:80 { # (1)!
    handle_path /api/static/* {
        root * /static_files/api
        file_server
    }
    handle /api/admin/* {  # (2)!
        # Block any IP address not on the allow list from accessing the Django admin console
        @blocked not remote_ip 10.1.1.16
        respond @blocked "Access Denied" 403
        reverse_proxy api:8000
    }
    handle /api/* {
        reverse_proxy api:8000
    }
    handle /assets/* {
        root * /static_files/frontend
        file_server
    }
    handle {
        root * /static_files/frontend
        file_server
        route {
            try_files {path} /index.html
            header /index.html Cache-Control "public, no-cache, max-age=0, must-revalidate"
        }
    }
}
```

1. To serve the site directly, change this to 
   ```
   tasks.example.com {
      ...
   ```
    banana
2. Restricting the Django admin console to specific IPs optional, but encouraged

### Running
Place those three files in the same directory and to start the site run
```shell
docker compose up -d
```

### Create a user and login
See [user management](user_management.md) for steps on creating a user and logging in.

## Delete everything and start again

!!! warning
    This will permanently delete everything. All users, all lists, all tasks, everything.

```shell
docker compose down --volumes
```