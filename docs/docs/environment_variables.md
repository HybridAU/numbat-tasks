# Environment Variables

All environment variables and what they do

## ALLOWED_HOSTS

**Default:** `""` (empty string)

Allowed host names that the API will accept, it can be a single value `example.com` or a comma seperated list of values
`example.com, tasks.example.com, example.org`
see [Django's documentation](https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts) for more details.

## DEBUG

**Default:** `False`

Debug should only be used in development, it is used to enable live reloading in the API, Frontend, and Documentation
containers.

## POSTGRES_DB

**Default:** `numbat_tasks`

Name of the postgres database, this will be automatically created when bringing up the containers for the first time.

## POSTGRES_HOST

**Default:** `database`

Used to specify the domain name of the database host, when using docker compose the host name will be automatically set
to the name of the container, but could be used if the database host was on a different machine.

## POSTGRES_PASSWORD

**Default:** `""` (empty string)

This should be randomly generated, any password generator will do, or for convenience you can run

```shell
echo POSTGRES_PASSWORD=$(dd if=/dev/urandom bs=1 count=18 status=none | base64) >> .env
```

## POSTGRES_PORT

**Default:** `5432`

Port for postgres server, you shouldn't need to change this unless you are running postgres on a non-standard port.

## POSTGRES_USER

**Default:** `numbat`

User to connect to postgres with.

## SECRET_KEY

**Default:** `""` (empty string)

The secret key is used by the API for things like signing [JWTs](https://jwt.io/) for more information
see [Django's documentation](https://docs.djangoproject.com/en/dev/ref/settings/#secret-key).

The api will refuse to start if the secret key is blank or contains the string `insecure` (key used in development).

A key can be generated with

```shell
echo SECRET_KEY=$(dd if=/dev/urandom bs=1 count=42 status=none | base64) >> .env
```

## UV_PROJECT_ENVIRONMENT

**Default:** `/venv`

Specifies the path for
the [uv virtual environment](https://docs.astral.sh/uv/configuration/environment/#uv_project_environment). Only really
relent during development.

## VERSION

**Default:** `""` (empty string)

Not used in the docker containers directly, but by docker compose to select the correct image to pull down and run.

## VITE_API_BASE_URL

**Default:** `""` (empty string)

URL for the api, this can be a full domain name for example you could have the frontend hosted by a CDN at
`https://tasks.example.com/` and the API on a different server at `https://api.example.com/`. Although then you would
need to set up [Django CORS headers](https://pypi.org/project/django-cors-headers/) which is not implemented yet.