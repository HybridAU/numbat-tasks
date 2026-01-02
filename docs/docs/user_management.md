# User Management

User management with a nice GUI through the frontend is still on the to do list, so for now we are using the Django admin console.

The recommended approach is to create an administrative user by running

## Create a super user
This will be the administrator of the numbat-tasks instance

```shell
docker compose exec -it api /venv/bin/python /api/manage.py createsuperuser
```

## Create are regular user
Once the super user has been created, log in to the [admin panel](http://localhost:8000/api/admin/accounts/customuser/) 
and create a regular user for day-to-day use, the user does not need any permissions other than "Active".