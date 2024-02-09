import pytest
from accounts.models import CustomUser
from rest_framework import status
from tasks.models import Task


@pytest.fixture()
def base_users():
    """
    To make the setup of most tests easier, we create two base users, Alice and Bob
    each with 5 tasks, (2 complete, 3 pending)
    """
    users = {}
    # Alice has a list of jobs to do
    alice = CustomUser.objects.create(
        email="alice@numbattasks.com",
        first_name="Alice",
        last_name="Numbat",
    )
    Task.objects.create(owner=alice, text="wash cloths", complete=True)
    Task.objects.create(owner=alice, text="ironing", complete=True)
    Task.objects.create(owner=alice, text="fold the cloths")
    Task.objects.create(owner=alice, text="put the cloths away")
    Task.objects.create(owner=alice, text="cook dinner")

    # Bob has a shopping list
    bob = CustomUser.objects.create(
        email="bob@numbattasks.com",
        first_name="Bob",
        last_name="Numbat",
    )
    Task.objects.create(owner=bob, text="milk", complete=True)
    Task.objects.create(owner=bob, text="eggs", complete=True)
    Task.objects.create(owner=bob, text="cheese")
    Task.objects.create(owner=bob, text="spam")
    Task.objects.create(owner=bob, text="bread")
    users["alice"] = alice
    users["bob"] = bob
    return users


@pytest.mark.django_db
def test_create_task(client, base_users):
    """
    A user can create a new task
    """
    client.force_login(base_users["alice"])
    response = client.post("/api/tasks/", data={"text": "wash the dishes"})
    assert response.status_code == status.HTTP_201_CREATED
    new_task_id = response.json()["id"]
    response = client.get("/api/tasks/")
    # The last item in the list, should be the newly added task
    assert response.json()[-1]["id"] == new_task_id
    assert response.json()[-1]["text"] == "wash the dishes"
    assert response.json()[-1]["complete"] is False


@pytest.mark.django_db
def test_check_one_task(client, base_users):
    """
    A user can access one task
    """
    client.force_login(base_users["alice"])
    # Get all tasks
    response = client.get("/api/tasks/")
    first_task_id = response.json()[0]["id"]
    # Get the first task by itself
    response = client.get(f"/api/tasks/{first_task_id}")
    assert response.json()["id"] == first_task_id
    assert response.json()["text"] == "wash cloths"
    assert response.json()["complete"] is True


@pytest.mark.django_db
def test_can_not_access_another_users_tasks(client, base_users):
    """
    Bob can not see Alice's tasks
    """
    client.force_login(base_users["alice"])
    # Get all tasks
    response = client.get("/api/tasks/")
    first_task_id = response.json()[0]["id"]
    # Get the first task by itself
    response = client.get(f"/api/tasks/{first_task_id}")
    assert response.status_code == status.HTTP_200_OK

    # Log in as Bob
    client.force_login(base_users["bob"])
    response = client.get(f"/api/tasks/{first_task_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
