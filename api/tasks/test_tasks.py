import json

import pytest
from rest_framework import status

from accounts.models import CustomUser
from tasks.models import List, Task


@pytest.fixture()
def base_users():
    """
    To make the setup of most tests easier, we create two base users, Alice and Bob
    each with 2 lists, and 5 tasks, (2 complete, 3 pending)
    """
    users = {}
    # Alice has a list of jobs to do
    alice = CustomUser.objects.create(
        email="alice@numbattasks.com",
        first_name="Alice",
        last_name="Numbat",
    )
    chores = List.objects.create(owner=alice, name="household chores")
    Task.objects.create(list=chores, text="wash cloths", complete=True)
    Task.objects.create(list=chores, text="ironing")
    shopping = List.objects.create(owner=alice, name="Shopping")
    Task.objects.create(list=shopping, text="spam", complete=True)
    Task.objects.create(list=shopping, text="eggs")
    Task.objects.create(list=shopping, text="cheese")

    # Bob has a shopping list
    bob = CustomUser.objects.create(
        email="bob@numbattasks.com",
        first_name="Bob",
        last_name="Numbat",
    )
    jobs = List.objects.create(owner=alice, name="jobs to be done")
    Task.objects.create(list=jobs, text="mow the lawn", complete=True)
    Task.objects.create(list=jobs, text="paint the house")
    books = List.objects.create(owner=alice, name="books I want to read")
    Task.objects.create(list=books, text="Terry Pratchett - Night Watch", complete=True)
    Task.objects.create(list=books, text="Andy Weir - Project Hail Mary")
    Task.objects.create(list=books, text="Ben Aaronovitch - Rivers of London")
    users["alice"] = alice
    users["bob"] = bob
    return users


@pytest.mark.django_db
def test_create_list(client, base_users):
    """
    A user can create a new list
    """
    client.force_login(base_users["alice"])
    response = client.post("/api/tasks/list/", data={"name": "Movies to watch"})
    assert response.status_code == status.HTTP_201_CREATED
    new_list_id = response.json()["id"]
    response = client.get("/api/tasks/list/")
    # The last item in the list, should be the newly added task
    assert response.json()[-1]["id"] == new_list_id
    assert response.json()[-1]["name"] == "Movies to watch"


@pytest.mark.django_db
def test_create_task(client, base_users):
    """
    A user can create a new task
    """
    client.force_login(base_users["alice"])
    response = client.get("/api/tasks/list/")
    assert response.status_code == status.HTTP_200_OK
    first_list_id = response.json()[0]["id"]
    response = client.post(
        f"/api/tasks/list/{first_list_id}/task/", data={"text": "wash the dishes"}
    )
    # The new task was created successfully
    assert response.status_code == status.HTTP_201_CREATED
    new_task_id = response.json()["id"]
    # The new task is in the list
    response = client.get(f"/api/tasks/list/{first_list_id}/task/")
    # The last item in the list, should be the newly added task
    assert response.json()[-1]["id"] == new_task_id
    assert response.json()[-1]["text"] == "wash the dishes"
    assert response.json()[-1]["complete"] is False
    # And we can access it directly
    response = client.get(f"/api/tasks/list/{first_list_id}/task/{new_task_id}/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == new_task_id
    assert response.json()["text"] == "wash the dishes"
    assert response.json()["complete"] is False


@pytest.mark.django_db
def test_update_a_task(client, base_users):
    """
    A user can update a task
    """
    client.force_login(base_users["alice"])
    # Get the first list
    response = client.get("/api/tasks/list/")
    first_list_id = response.json()[0]["id"]
    # Get the last task on that list
    response = client.get(f"/api/tasks/list/{first_list_id}/task/")
    last_task_id = response.json()[-1]["id"]
    response = client.get(f"/api/tasks/list/{first_list_id}/task/{last_task_id}/")
    # Make sure it's not already complete
    assert response.json()["complete"] is False
    # Update the task
    response = client.put(
        f"/api/tasks/list/{first_list_id}/task/{last_task_id}/",
        # We should just be pass a dictionary here, but it seems to be broken
        # so we pass a string and explicitly set the content type
        data=json.dumps({"complete": True}),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_200_OK
    # Check when we get the task again, it's now complete
    response = client.get(f"/api/tasks/list/{first_list_id}/task/{last_task_id}/")
    # Make sure it's not already complete
    assert response.json()["complete"] is True


# TODO: More of these tests, this feels like somewhere it's easy to slip up
#       and have direct object reference bugs or similar.
@pytest.mark.django_db
def test_can_not_access_another_users_tasks(client, base_users):
    """
    Bob can not see Alice's tasks
    """
    client.force_login(base_users["alice"])
    # Get lists
    response = client.get("/api/tasks/list/")
    list_id = response.json()[0]["id"]
    # Get the first task by itself
    response = client.get(f"/api/tasks/list/{list_id}/task/")
    assert response.status_code == status.HTTP_200_OK
    # Get a task from the list
    task_id = response.json()[0]["id"]
    response = client.get(f"/api/tasks/list/{list_id}/task/{task_id}/")
    assert response.status_code == status.HTTP_200_OK

    # Log in as Bob
    client.force_login(base_users["bob"])
    # Bob can't see the list
    response = client.get(f"/api/tasks/list/{list_id}/")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # Bob can't see the task
    response = client.get(f"/api/tasks/list/{list_id}/task/{task_id}/")
    assert response.status_code == status.HTTP_404_NOT_FOUND
