import json

import pytest
from rest_framework import status

from numbat_tasks_api.test_utils import generate_base_data


@pytest.fixture()
def base_data(client):
    return generate_base_data(client)


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
def test_can_not_search_for_another_users_tasks(client, base_data):
    """
    Bob can not search for a task and find a list that belongs to Alice
    """
    search = "/api/tasks/list/?search=cheese"
    # When Bob searches for "cheese" he gets no results
    response = client.get(search, headers=base_data["bob"]["auth_header"])
    assert response.json() == []
    # But when Alice does the same search, she gets her shopping list come back
    response = client.get(search, headers=base_data["alice"]["auth_header"])
    assert response.json()[0]["name"] == "Shopping"


@pytest.mark.django_db
def test_can_not_call_uncheck_all_tasks_for_another_users_list(client, base_data):
    """
    Bob can not call `uncheck_all_tasks` for Alice's shopping list.
    """
    endpoint = f"/api/tasks/list/{base_data['alice']['shopping'].id}/uncheck_all_tasks/"
    spam_task = f"/api/tasks/list/{base_data['alice']['shopping'].id}/task/{base_data['alice']['spam'].id}/"
    # When Bob calls the endpoint he gets a 404 because he can't access the list
    response = client.post(endpoint, headers=base_data["bob"]["auth_header"])
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # And spam is still complete
    response = client.get(spam_task, headers=base_data["alice"]["auth_header"])
    assert response.json()["complete"] is True
    # But when Alice calls the same endpoint, she gets a success response
    response = client.post(endpoint, headers=base_data["alice"]["auth_header"])
    assert response.status_code == status.HTTP_200_OK
    # And spam has been unchecked
    response = client.get(spam_task, headers=base_data["alice"]["auth_header"])
    assert response.json()["complete"] is False


@pytest.mark.django_db
def test_can_search_a_list_by_task_name_or_list_name(client, base_data):
    """
    Can search for a task in a list, or the name of a list and both will find results.
    """
    # Searching for egg (full text is "eggs" with an s) finds the shopping list
    response = client.get(
        "/api/tasks/list/?search=egg",
        headers=base_data["alice"]["auth_header"],
    )
    assert response.json()[0]["name"] == "Shopping"
    # Searching shop also finds the shopping list
    response = client.get(
        "/api/tasks/list/?search=shop",
        headers=base_data["alice"]["auth_header"],
    )
    assert response.json()[0]["name"] == "Shopping"


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
    # Add avocado to the shopping list
    response = client.post(
        f"/api/tasks/list/{shopping.id}/task/",
        data={"text": "avocado"},
        headers=headers,
    )
    assert response.status_code == status.HTTP_201_CREATED
    avocado_id = response.json()["id"]
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
    assert response.json()[0]["id"] == avocado_id
    assert response.json()[1]["id"] == base_data["alice"]["eggs"].id
    assert response.json()[2]["id"] == base_data["alice"]["cheese"].id
    assert response.json()[3]["id"] == base_data["alice"]["spam"].id
    # Next bacon, and again it's at the top of the list, bumping avocado down to second place,
    # followed by the items that have been manually ordered.
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
    response = client.get(f"/api/tasks/list/{shopping.id}/task/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0]["id"] == bacon_id
    assert response.json()[1]["id"] == avocado_id
    assert response.json()[2]["id"] == base_data["alice"]["eggs"].id
    assert response.json()[3]["id"] == base_data["alice"]["cheese"].id
    assert response.json()[4]["id"] == base_data["alice"]["spam"].id


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
