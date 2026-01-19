# User Management

## The first user
The first user to sign up to a numbat tasks instance will be marked as a "superuser". This user can 
manage other users, create new accounts, reset passwords, and delete accounts.

One user can sign up even with the `SIGNUP_ENABLED` [environment variable](environment_variables.md#signup_enabled)
is set to false (the default)

The API endpoints exist for user management, however a nice GUI through the frontend is still on the to-do list,
so for now the Django admin console is the only way to manage users.

While the first user to sign up is a superuser, they do not get the "staff" status, this is by design as
long term we don't want users to have to log into the Django admin console. However, for now we will need
to create a superuser with the staff status.

## Create a superuser with the staff status
This will create a superuser that can log in to the Django admin console.

```shell
docker compose exec -it api /venv/bin/python /api/manage.py createsuperuser
```

## Create and manage other users
Once the superuser has been created, log in to the [admin panel](http://localhost:8000/api/admin/accounts/customuser/) 
and from there you can create/update/delete other users (and tasks)