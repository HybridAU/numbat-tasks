import json
import random
import string

import pytest
from rest_framework import status

from accounts.models import CustomUser
from numbat_tasks_api.test_utils import generate_base_data


@pytest.fixture()
def base_data(client):
    return generate_base_data(client)


@pytest.mark.django_db
def test_view_all_users(client, base_data):
    """
    An unauthenticated user can't see users, but an authenticated user can see a list of all users
    """
    # Unauthenticated can not get a list of users
    response = client.get("/api/accounts/user/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    # For this project, I don't consider user enumeration a vulnerability.
    # Authenticated, regular user can get a list of users
    response = client.get(
        "/api/accounts/user/", headers=base_data["bob"]["auth_header"]
    )
    assert response.status_code == status.HTTP_200_OK
    first_user = response.json()[0]
    assert first_user.get("email") == base_data["alice"]["email"]
    assert first_user.get("id") == base_data["alice"]["id"]


@pytest.mark.django_db
def test_password_hash_is_never_returned(client, base_data):
    """
    The password hash is never returned
    """
    # Authenticated, superuser can get a list of users, but not a password hash
    response = client.get(
        "/api/accounts/user/", headers=base_data["alice"]["auth_header"]
    )
    assert response.status_code == status.HTTP_200_OK
    first_user = response.json()[0]
    assert first_user.get("email") == base_data["alice"]["email"]
    assert "password" not in first_user
    # Authenticated, superuser can get an individual users, but not a password hash
    response = client.get(
        f"/api/accounts/user/{base_data['alice']['id']}/",
        headers=base_data["alice"]["auth_header"],
    )
    assert response.status_code == status.HTTP_200_OK
    individual_user = response.json()
    assert individual_user.get("email") == base_data["alice"]["email"]
    assert "password" not in individual_user


@pytest.mark.django_db
def test_superuser_can_create_new_users(client, base_data):
    """
    Alice the admin (superuser) can create a new user
    """
    # Authenticated, superuser can create a new user
    response = client.post(
        "/api/accounts/user/",
        headers=base_data["alice"]["auth_header"],
        data={
            "email": "charlie@numbat-tasks.com",
            "first_name": "Charlie",
            "last_name": "Numbat",
            "password": "".join(
                random.choices(string.ascii_letters + string.digits, k=18)
            ),
            "is_superuser": False,
        },
    )
    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_regular_user_can_not_create_new_users(client, base_data):
    """
    Bob, a regular user can't create a new user
    """
    # Authenticated, superuser can create a new user
    response = client.post(
        "/api/accounts/user/",
        headers=base_data["bob"]["auth_header"],
        data={
            "email": "charlie@numbat-tasks.com",
            "first_name": "Charlie",
            "last_name": "Numbat",
            "password": "".join(
                random.choices(string.ascii_letters + string.digits, k=18)
            ),
            "is_superuser": False,
        },
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_regular_user_can_update_their_details(client, base_data):
    """
    Bob, a regular user can update his details
    """
    bob_id = base_data["bob"]["id"]
    response = client.patch(
        f"/api/accounts/user/{bob_id}/",
        headers=base_data["bob"]["auth_header"],
        # patch doesn't have the "json" parameter, so we have to do data that we json encode ourselves,
        # and we also need to add the content type header.
        data=json.dumps({"first_name": "Robert"}),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_200_OK
    bob_object = CustomUser.objects.get(id=bob_id)
    assert bob_object.first_name == "Robert"


@pytest.mark.django_db
def test_regular_user_can_not_make_themself_a_superuser_patch(client, base_data):
    """
    Bob, a regular user, can not make himself a superuser
    """
    bob_id = base_data["bob"]["id"]
    response = client.patch(
        f"/api/accounts/user/{bob_id}/",
        headers=base_data["bob"]["auth_header"],
        # patch doesn't have the "json" parameter, so we have to do data that we json encode ourselves,
        # and we also need to add the content type header.
        data=json.dumps({"is_superuser": True}),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    bob_object = CustomUser.objects.get(id=bob_id)
    assert not bob_object.is_superuser


@pytest.mark.django_db
def test_regular_user_can_not_make_themself_a_superuser_put(client, base_data):
    """
    Bob, a regular user, can not make himself a superuser
    """
    # Same as the test above, but with put instead of patch
    bob_id = base_data["bob"]["id"]
    response = client.put(
        f"/api/accounts/user/{bob_id}/",
        headers=base_data["bob"]["auth_header"],
        # patch doesn't have the "json" parameter, so we have to do data that we json encode ourselves,
        # and we also need to add the content type header.
        data=json.dumps(
            {
                "email": "bob@numbat-tasks.com",
                "first_name": "Bob",
                "last_name": "Numbat",
                "password": "".join(
                    random.choices(string.ascii_letters + string.digits, k=18)
                ),
                "is_superuser": True,
            }
        ),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    bob_object = CustomUser.objects.get(id=bob_id)
    assert not bob_object.is_superuser


@pytest.mark.django_db
def test_a_superuser_can_update_other_users(client, base_data):
    """
    Alice a superuser, she can make Bob a superuser too
    """
    bob_id = base_data["bob"]["id"]
    response = client.patch(
        f"/api/accounts/user/{bob_id}/",
        headers=base_data["alice"]["auth_header"],
        # patch doesn't have the "json" parameter, so we have to do data that we json encode ourselves,
        # and we also need to add the content type header.
        data=json.dumps({"is_superuser": True}),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_200_OK
    bob_object = CustomUser.objects.get(id=bob_id)
    assert bob_object.is_superuser


@pytest.mark.django_db
def test_unauthenticated_user_can_not_access_any_endpoints(client, base_data):
    """
    An unauthenticated user can not access any endpoints (except signup)
    """
    # We should be blocked before the validation happens, so we don't bother passing through
    # any data in our post/patch/put requests, but we do need a valid id for the path
    alice_id = base_data["alice"]["id"]
    response = client.get("/api/accounts/user/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.post("/api/accounts/user/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.get(f"/api/accounts/user/{alice_id}/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.put(f"/api/accounts/user/{alice_id}/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.patch(f"/api/accounts/user/{alice_id}/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.delete(f"/api/accounts/user/{alice_id}/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_regular_user_can_not_access_other_users(client, base_data):
    """
    Bob, an authenticated regular user can not directly access other user objects
    """
    # Bob can get a list of all users (which contains the same information as the get endpoint)
    # but can't directly get, update, or delete other users.
    alice_id = base_data["alice"]["id"]
    auth_header = base_data["bob"]["auth_header"]
    response = client.get(f"/api/accounts/user/{alice_id}/", headers=auth_header)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.put(f"/api/accounts/user/{alice_id}/", headers=auth_header)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.patch(f"/api/accounts/user/{alice_id}/", headers=auth_header)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.delete(f"/api/accounts/user/{alice_id}/", headers=auth_header)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_superuser_user_can_modify_other_users(client, base_data):
    """
    Alice, an authenticated superuser user can update other users
    """
    bob_id = base_data["bob"]["id"]
    auth_header = base_data["alice"]["auth_header"]
    response = client.get(f"/api/accounts/user/{bob_id}/", headers=auth_header)
    assert response.status_code == status.HTTP_200_OK
    response = client.put(
        f"/api/accounts/user/{bob_id}/",
        headers=auth_header,
        # put doesn't have the "json" parameter, so we have to do data that we json encode ourselves,
        # and we also need to add the content type header.
        data=json.dumps(
            {
                "email": "rober@numbat-tasks.com",
                "password": "We Are Legion",
                "first_name": "Robert",
                "last_name": "Johansson",
                "is_superuser": True,
            }
        ),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_200_OK
    response = client.patch(
        f"/api/accounts/user/{bob_id}/",
        headers=auth_header,
        data=json.dumps({"first_name": "Riker"}),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_200_OK
    response = client.delete(f"/api/accounts/user/{bob_id}/", headers=auth_header)
    assert response.status_code == status.HTTP_204_NO_CONTENT


# TODO
#  * Tests that passwords are hashed when creating and updating users
#  * Test signup process
#   * Unauthenticated user can sign up if there are no users (initial setup)
#   * Test signups_enabled bool does what it's meant to
#   * Can't set "is_superuser" during signup, it's fixed based on if there are any users
#  * Regular user can update their password (with old one?)
