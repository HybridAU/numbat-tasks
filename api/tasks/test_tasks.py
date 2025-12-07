import json
import random
import string

import pytest
from rest_framework import status

from accounts.models import CustomUser
from tasks.models import List, Task


@pytest.fixture()
def base_data(client):
    """
    To make the setup of most tests easier, we create two base users, Alice and Bob
    each with 2 lists, and 5 tasks, (2 complete, 3 pending)
    """
    data = {
        "alice": {
            "email": "alice@numbattasks.com",
            "first_name": "Alice",
            "last_name": "Numbat",
            "password": "".join(
                random.choices(string.ascii_letters + string.digits, k=18)
            ),
        },
        "bob": {
            "email": "bob@numbattasks.com",
            "first_name": "Alice",
            "last_name": "Numbat",
            "password": "".join(
                random.choices(string.ascii_letters + string.digits, k=18)
            ),
        },
    }
    # Create and login for both users
    alice = CustomUser.objects.create(**data["alice"])
    alice.clean()
    alice.save()
    response = client.post(
        "/api/token/",
        data={
            "email": data["alice"]["email"],
            "password": data["alice"]["password"],
        },
    )
    data["alice"]["auth_header"] = {
        "Authorization": f"Bearer {response.json()['access']}"
    }

    bob = CustomUser.objects.create(**data["bob"])
    bob.clean()
    bob.save()
    response = client.post(
        "/api/token/",
        data={
            "email": data["bob"]["email"],
            "password": data["bob"]["password"],
        },
    )
    data["bob"]["auth_header"] = {
        "Authorization": f"Bearer {response.json()['access']}"
    }

    # Alice has a list of chores, and a shopping list
    data["alice"]["chores"] = List.objects.create(owner=alice, name="household chores")
    data["alice"]["wash cloths"] = Task.objects.create(
        list=data["alice"]["chores"],
        text="wash cloths",
        complete=True,
    )
    data["alice"]["ironing"] = Task.objects.create(
        list=data["alice"]["chores"],
        text="ironing",
    )
    data["alice"]["shopping"] = List.objects.create(
        owner=alice,
        name="Shopping",
        sort_order="manual",
    )
    data["alice"]["spam"] = Task.objects.create(
        list=data["alice"]["shopping"],
        text="spam",
        complete=True,
    )
    data["alice"]["eggs"] = Task.objects.create(
        list=data["alice"]["shopping"],
        text="eggs",
    )
    data["alice"]["cheese"] = Task.objects.create(
        list=data["alice"]["shopping"],
        text="cheese",
    )
    # Set a manual order for Alice's shopping list
    data["alice"]["shopping"].manual_order = [
        data["alice"]["eggs"].id,
        data["alice"]["cheese"].id,
        data["alice"]["spam"].id,
    ]
    data["alice"]["shopping"].save()

    # Bob has a jobs to do, and books to read
    data["bob"]["jobs"] = List.objects.create(owner=bob, name="jobs to be done")
    data["bob"]["mow the lawn"] = Task.objects.create(
        list=data["bob"]["jobs"],
        text="mow the lawn",
        complete=True,
    )
    data["bob"]["paint the house"] = Task.objects.create(
        list=data["bob"]["jobs"],
        text="paint the house",
    )
    data["bob"]["books"] = List.objects.create(owner=bob, name="books I want to read")
    Task.objects.create(
        list=data["bob"]["books"],
        text="Terry Pratchett - Night Watch",
        complete=True,
    )
    Task.objects.create(
        list=data["bob"]["books"],
        text="Andy Weir - Project Hail Mary",
    )
    Task.objects.create(
        list=data["bob"]["books"],
        text="Ben Aaronovitch - Rivers of London",
    )

    return data


@pytest.mark.django_db
def test_create_list(client, base_data):
    """
    A user can create a new list
    """
    alice = base_data["alice"]["auth_header"]
    response = client.post(
        "/api/tasks/list/",
        data={"name": "Movies to watch"},
        headers=alice,
    )
    assert response.status_code == status.HTTP_201_CREATED
    new_list_id = response.json()["id"]
    response = client.get("/api/tasks/list/", headers=alice)
    # The last item in the list, should be the newly added task
    assert response.json()[-1]["id"] == new_list_id
    assert response.json()[-1]["name"] == "Movies to watch"


@pytest.mark.django_db
def test_create_task(client, base_data):
    """
    A user can create a new task
    """
    headers = base_data["alice"]["auth_header"]
    chores_id = base_data["alice"]["chores"].id
    response = client.post(
        f"/api/tasks/list/{chores_id}/task/",
        data={"text": "wash the dishes"},
        headers=headers,
    )
    # The new task was created successfully
    assert response.status_code == status.HTTP_201_CREATED
    new_task_id = response.json()["id"]
    # The new task is in the list
    response = client.get(f"/api/tasks/list/{chores_id}/task/", headers=headers)
    # The last item in the list, should be the newly added task
    assert response.json()[-1]["id"] == new_task_id
    assert response.json()[-1]["text"] == "wash the dishes"
    assert response.json()[-1]["complete"] is False
    # And we can access it directly
    response = client.get(
        f"/api/tasks/list/{chores_id}/task/{new_task_id}/",
        headers=headers,
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == new_task_id
    assert response.json()["text"] == "wash the dishes"
    assert response.json()["complete"] is False


@pytest.mark.django_db
def test_update_a_task(client, base_data):
    """
    A user can update a task
    """
    headers = base_data["alice"]["auth_header"]
    chores_id = base_data["alice"]["chores"].id
    ironing = base_data["alice"]["ironing"]
    # Make sure it's not already complete
    assert ironing.complete is False
    # Update the task
    response = client.patch(
        f"/api/tasks/list/{chores_id}/task/{ironing.id}/",
        headers=headers,
        # patch doesn't have the "json" parameter, so we have to do data that we json encode ourselves,
        # and we also need to add the content type header.
        data=json.dumps({"complete": True}),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_200_OK
    # Check when we get the task again, it's now complete
    response = client.get(
        f"/api/tasks/list/{chores_id}/task/{ironing.id}/",
        headers=headers,
    )
    # Make sure it's not already complete
    assert response.json()["complete"] is True


# TODO: More of these tests, this feels like somewhere it's easy to slip up
#       and have direct object reference bugs or similar.
@pytest.mark.django_db
def test_can_not_access_another_users_tasks(client, base_data):
    """
    Bob can not see Alice's tasks
    """
    alice = base_data["alice"]["auth_header"]
    bob = base_data["bob"]["auth_header"]
    response = client.get("/api/tasks/list/", headers=alice)
    list_id = response.json()[0]["id"]
    # Get the first task by itself
    response = client.get(f"/api/tasks/list/{list_id}/task/", headers=alice)
    assert response.status_code == status.HTTP_200_OK
    # Get a task from the list
    task_id = response.json()[0]["id"]
    response = client.get(f"/api/tasks/list/{list_id}/task/{task_id}/", headers=alice)
    assert response.status_code == status.HTTP_200_OK

    # Bob can't see the list
    response = client.get(f"/api/tasks/list/{list_id}/", headers=bob)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # Bob can't see the task
    response = client.get(f"/api/tasks/list/{list_id}/task/{task_id}/", headers=bob)
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_manual_list_order(client, base_data):
    """
    A user can manually sort a list
    """
    headers = base_data["alice"]["auth_header"]
    shopping = base_data["alice"]["shopping"]
    response = client.get(f"/api/tasks/list/{shopping.id}/task/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    # Check the shopping items are returned in the order set in manual_order
    assert response.json()[0]["id"] == base_data["alice"]["eggs"].id
    assert response.json()[1]["id"] == base_data["alice"]["cheese"].id
    assert response.json()[2]["id"] == base_data["alice"]["spam"].id


@pytest.mark.django_db
def test_manual_list_order_new_tasks(client, base_data):
    """
    New tasks are added to the top of the list if they don't exist in the manual_order
    """
    headers = base_data["alice"]["auth_header"]
    shopping = base_data["alice"]["shopping"]
    # Add a new book to the list
    response = client.post(
        f"/api/tasks/list/{shopping.id}/task/",
        data={"text": "bacon"},
        headers=headers,
    )
    assert response.status_code == status.HTTP_201_CREATED
    bacon_id = response.json()["id"]
    response = client.get(f"/api/tasks/list/{shopping.id}/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    # Check the manual order still only has 3 items
    assert response.json()["manual_order"] == [
        base_data["alice"]["eggs"].id,
        base_data["alice"]["cheese"].id,
        base_data["alice"]["spam"].id,
    ]

    # Check the shopping list is returned in the order set in manual_order,
    # but with the new item at the top of the list
    response = client.get(f"/api/tasks/list/{shopping.id}/task/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0]["id"] == bacon_id
    assert response.json()[1]["id"] == base_data["alice"]["eggs"].id
    assert response.json()[2]["id"] == base_data["alice"]["cheese"].id
    assert response.json()[3]["id"] == base_data["alice"]["spam"].id


@pytest.mark.django_db
def test_manual_list_order_update_order(client, base_data):
    """
    Updating the manual_order changes the order the tasks are returned
    """
    headers = base_data["alice"]["auth_header"]
    shopping = base_data["alice"]["shopping"]
    # Update the order
    client.patch(
        f"/api/tasks/list/{shopping.id}/",
        # patch doesn't have the "json" parameter, so we have to do data that we json encode ourselves,
        # and we also need to add the content type header.
        content_type="application/json",
        data=json.dumps(
            {
                "manual_order": [
                    base_data["alice"]["cheese"].id,
                    base_data["alice"]["spam"].id,
                    base_data["alice"]["eggs"].id,
                ]
            }
        ),
        headers=headers,
    )
    response = client.get(f"/api/tasks/list/{shopping.id}/task/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0]["id"] == base_data["alice"]["cheese"].id
    assert response.json()[1]["id"] == base_data["alice"]["spam"].id
    assert response.json()[2]["id"] == base_data["alice"]["eggs"].id


@pytest.mark.django_db
def test_manual_list_order_id_from_another_list(client, base_data):
    """
    Including an id from another list (or another user) doesn't include the task in the response.
    """
    headers = base_data["alice"]["auth_header"]
    shopping = base_data["alice"]["shopping"]
    # Update the order
    client.patch(
        f"/api/tasks/list/{shopping.id}/",
        content_type="application/json",
        data=json.dumps(
            {
                "manual_order": [
                    base_data["alice"]["cheese"].id,
                    # Another users task
                    base_data["bob"]["mow the lawn"].id,
                    base_data["alice"]["spam"].id,
                    # Alice's task, but from another list
                    base_data["alice"]["ironing"].id,
                    base_data["alice"]["eggs"].id,
                    # A random negative number thrown in for kicks
                    -5,
                ]
            }
        ),
        headers=headers,
    )
    response = client.get(f"/api/tasks/list/{shopping.id}/task/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 3
    assert response.json()[0]["id"] == base_data["alice"]["cheese"].id
    assert response.json()[1]["id"] == base_data["alice"]["spam"].id
    assert response.json()[2]["id"] == base_data["alice"]["eggs"].id


@pytest.mark.django_db
def test_alphabetical_list_order(client, base_data):
    """
    Can set the list order to alphabetical
    """
    headers = base_data["alice"]["auth_header"]
    shopping = base_data["alice"]["shopping"]
    # Update the order to alpha
    client.patch(
        f"/api/tasks/list/{shopping.id}/",
        content_type="application/json",
        data=json.dumps({"sort_order": "text"}),
        headers=headers,
    )
    response = client.get(f"/api/tasks/list/{shopping.id}/task/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0]["id"] == base_data["alice"]["cheese"].id
    assert response.json()[1]["id"] == base_data["alice"]["eggs"].id
    assert response.json()[2]["id"] == base_data["alice"]["spam"].id
