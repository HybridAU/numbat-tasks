import json
import random
import string

import pytest
from django.test import override_settings
from rest_framework import status

from accounts.models import CustomUser
from numbat_tasks_api.test_utils import generate_base_data


def generate_password():
    """
    A little utility function to generate a random password to use in tests.
    """
    return random.choices(string.ascii_letters + string.digits, k=18)


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
def test_self_endpoint(client, base_data):
    """
    Check calling the self endpoint returns information about yourself
    """
    response = client.get(
        "/api/accounts/user/self/",
        headers=base_data["bob"]["auth_header"],
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == base_data["bob"]["id"]
    assert response.json()["email"] == base_data["bob"]["email"]
    assert response.json()["first_name"] == base_data["bob"]["first_name"]
    assert response.json()["last_name"] == base_data["bob"]["last_name"]
    assert response.json()["is_superuser"] is False


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
            "password": f"{generate_password()}",
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
            "password": f"{generate_password()}",
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
def test_put_method_is_unavalible(client, base_data):
    """
    Alice can not call the PUT method for the users endpoint
    """
    # Same as the test above, but with put instead of patch
    bob_id = base_data["bob"]["id"]
    response = client.put(
        f"/api/accounts/user/{bob_id}/",
        headers=base_data["alice"]["auth_header"],
        # put doesn't have the "json" parameter, so we have to do data that we json encode ourselves,
        # and we also need to add the content type header.
        data=json.dumps(
            {
                "email": "bob@numbat-tasks.com",
                "first_name": "Bob",
                "last_name": "Numbat",
                "password": f"{generate_password()}",
                "is_superuser": True,
            }
        ),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


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
    # Authenticated users get a 405 here, but unauthenticated still gets a 401
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.patch(f"/api/accounts/user/{alice_id}/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.delete(f"/api/accounts/user/{alice_id}/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.delete("/api/accounts/user/self/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    response = client.post(f"/api/accounts/user/{alice_id}/change_password/")
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
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    response = client.patch(f"/api/accounts/user/{alice_id}/", headers=auth_header)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.delete(f"/api/accounts/user/{alice_id}/", headers=auth_header)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.post(
        f"/api/accounts/user/{alice_id}/change_password/",
        data={"new_password": "foo"},
        headers=auth_header,
    )
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
    response = client.patch(
        f"/api/accounts/user/{bob_id}/",
        headers=auth_header,
        # put doesn't have the "json" parameter, so we have to do data that we json encode ourselves,
        # and we also need to add the content type header.
        data=json.dumps(
            {
                "email": "rober@numbat-tasks.com",
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


@pytest.mark.django_db
def test_must_use_the_change_password_endpoint_to_update_passwords(client, base_data):
    """
    Alice, an authenticated superuser must still use the change_password endpoint
    to update a user's password.
    """
    bob_id = base_data["bob"]["id"]
    auth_header = base_data["alice"]["auth_header"]
    response = client.get(f"/api/accounts/user/{bob_id}/", headers=auth_header)
    assert response.status_code == status.HTTP_200_OK
    response = client.patch(
        f"/api/accounts/user/{bob_id}/",
        headers=auth_header,
        data=json.dumps(
            {
                "email": "rober@numbat-tasks.com",
                "password": f"{generate_password()}",
                "first_name": "Robert",
                "last_name": "Johansson",
                "is_superuser": True,
            }
        ),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {
        "password": "Use the change_password endpoint to update passwords"
    }


@pytest.mark.django_db
def test_a_regular_user_can_update_their_password_only_with_old_password(
    client, base_data
):
    """
    Bob can update his password, but only when he provides his old password.
    """
    # Bob can't directly update his password.
    bob_id = base_data["bob"]["id"]
    auth_header = base_data["bob"]["auth_header"]
    new_password = f"{generate_password()}"
    response = client.patch(
        f"/api/accounts/user/{bob_id}/",
        headers=auth_header,
        data=json.dumps({"password": new_password}),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json() == {
        "password": "Use the change_password endpoint to update passwords"
    }
    # Bob can't call change_password without providing the old one
    response = client.post(
        f"/api/accounts/user/{bob_id}/change_password/",
        headers=auth_header,
        data={"new_password": new_password},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"old_password": "old_password does not match"}
    # Bob can't call change_password if he provides the wrong old password.
    response = client.post(
        f"/api/accounts/user/{bob_id}/change_password/",
        headers=auth_header,
        data={
            "old_password": f"{generate_password()}",
            "new_password": new_password,
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"old_password": "old_password does not match"}
    # Finally, bob can update his password with the correct old one
    response = client.post(
        f"/api/accounts/user/{bob_id}/change_password/",
        headers=auth_header,
        data={
            "old_password": base_data["bob"]["password"],
            "new_password": new_password,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    # And now just to prove it, he logs in with his new password.
    response = client.post(
        "/api/token/",
        data={
            "email": base_data["bob"]["email"],
            "password": new_password,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.json()


@pytest.mark.django_db
def test_a_superuser_can_update_their_password_only_with_old_password(
    client, base_data
):
    """
    Alice can update her password, but only when she provides her old password.
    """
    # This is pretty much a straight copy-paste of the test above, but with alice instead of bob
    alice_id = base_data["alice"]["id"]
    auth_header = base_data["alice"]["auth_header"]
    new_password = f"{generate_password()}"
    response = client.patch(
        f"/api/accounts/user/{alice_id}/",
        headers=auth_header,
        data=json.dumps({"password": new_password}),
        content_type="application/json",
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json() == {
        "password": "Use the change_password endpoint to update passwords"
    }
    # Alice can't call change_password without providing the old one
    response = client.post(
        f"/api/accounts/user/{alice_id}/change_password/",
        headers=auth_header,
        data={"new_password": new_password},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"old_password": "old_password does not match"}
    # Alice can't call change_password if he provides the wrong old password.
    response = client.post(
        f"/api/accounts/user/{alice_id}/change_password/",
        headers=auth_header,
        data={
            "old_password": f"{generate_password()}",
            "new_password": new_password,
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"old_password": "old_password does not match"}
    # Finally, alice can update her password with the correct old one
    response = client.post(
        f"/api/accounts/user/{alice_id}/change_password/",
        headers=auth_header,
        data={
            "old_password": base_data["alice"]["password"],
            "new_password": new_password,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    # And now just to prove it, she logs in with her new password.
    response = client.post(
        "/api/token/",
        data={
            "email": base_data["alice"]["email"],
            "password": new_password,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.json()


@pytest.mark.django_db
def test_bob_can_not_change_alices_password(client, base_data):
    """
    Bob can't change Alice's password, even with the correct old one.
    """
    # This is pretty much a straight copy-paste of the test above, but with alice instead of bob
    alice_id = base_data["alice"]["id"]
    auth_header = base_data["bob"]["auth_header"]
    response = client.post(
        f"/api/accounts/user/{alice_id}/change_password/",
        headers=auth_header,
        data={
            "old_password": base_data["alice"]["password"],
            "new_password": f"{generate_password()}",
        },
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_alice_can_change_bobs_password(client, base_data):
    """
    Alice a superuser, can set a new password for Bob, even without his old one.
    """
    bob_id = base_data["bob"]["id"]
    auth_header = base_data["alice"]["auth_header"]
    response = client.post(
        f"/api/accounts/user/{bob_id}/change_password/",
        headers=auth_header,
        data={"new_password": f"{generate_password()}"},
    )
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_passwords_are_hashed_when_creating_and_updating_users():
    """
    Passwords are hashed when creating and updating users
    """
    # We are not going to get into the weeds here of how the hashing works, because we are using
    # Django's make_password function, and we leave it up to that to decide (PBKDF2, etc...)
    # but we check that saving a user, the password isn't saved directly to the database.
    new_password = f"{generate_password()}"
    # First, create a user
    user = CustomUser.objects.create(
        email="charlie@numbat-tasks.com",
        password=new_password,
    )
    # The password has been hashed when the user was created
    assert user.password != new_password
    # Reset the password
    user.password = new_password
    assert user.password == new_password
    # As soon as we save it, the password is hashed
    user.save()
    assert user.password != new_password


@pytest.mark.django_db
def test_a_new_user_can_signup_if_there_are_no_existing_users(client):
    """
    Unauthenticated user can sign up if there are no users (initial setup)
    """
    password = f"{generate_password()}"
    # Just to make sure, signup is not enabled, but initial setup is set
    response = client.get("/api/config/")
    assert response.json()["initial_setup"] is True
    assert response.json()["signup_enabled"] is False
    # Sign up
    response = client.post(
        "/api/accounts/user/signup/",
        data={
            "email": "alice@numbat-tasks.com",
            "password": password,
            "first_name": "Alice",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    # Now signups should be disabled
    response = client.get("/api/config/")
    assert response.json()["initial_setup"] is False
    assert response.json()["signup_enabled"] is False
    # And Bob can't sign up
    response = client.post(
        "/api/accounts/user/signup/",
        data={
            "email": "bob@numbat-tasks.com",
            "password": f"{generate_password()}",
            "first_name": "Bob",
        },
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    # And just as a sanity check, Alice can log in.
    response = client.post(
        "/api/token/",
        data={
            "email": "alice@numbat-tasks.com",
            "password": password,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    access_token = response.json().get("access")
    # Also as a sanity check, the first user is a superuser
    response = client.get(
        "/api/accounts/user/self/",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert response.json()["is_superuser"] is True
    assert response.json()["email"] == "alice@numbat-tasks.com"


@pytest.mark.django_db
@override_settings(SIGNUP_ENABLED=True)
def test_enabling_signups(client, base_data):
    """
    Unauthenticated user can sign up if signups are enabled (even though there are existing users)
    """
    password = f"{generate_password()}"
    # Just to make sure, signup is not enabled, and it's not the initial setup
    response = client.get("/api/config/")
    assert response.json()["initial_setup"] is False
    assert response.json()["signup_enabled"] is True
    # Sign up
    response = client.post(
        "/api/accounts/user/signup/",
        data={
            "email": "charlie@numbat-tasks.com",
            "password": password,
            "first_name": "Charlie",
            "last_name": "Numbat",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    # As a sanity check, Charlie can log in.
    response = client.post(
        "/api/token/",
        data={
            "email": "charlie@numbat-tasks.com",
            "password": password,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    access_token = response.json().get("access")
    # And charlie is not a superuser
    response = client.get(
        "/api/accounts/user/self/",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert response.json()["is_superuser"] is False
    assert response.json()["email"] == "charlie@numbat-tasks.com"


@pytest.mark.django_db
@override_settings(SIGNUP_ENABLED=True)
def test_cant_set_superuser_during_signup(client, base_data):
    """
    Can't set is_superuser during signup
    """
    password = f"{generate_password()}"
    client.post(
        "/api/accounts/user/signup/",
        data={
            "email": "eve@numbat-tasks.com",
            "password": password,
            "first_name": "Eve",
            "last_name": "Numbat",
            # Eve tries to sign up as a superuser
            "is_superuser": True,
        },
    )
    response = client.post(
        "/api/token/",
        data={
            "email": "eve@numbat-tasks.com",
            "password": password,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    access_token = response.json().get("access")
    # Eve has signed up successfully, but she is not a superuser
    response = client.get(
        "/api/accounts/user/self/",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert response.json()["is_superuser"] is False
    assert response.json()["email"] == "eve@numbat-tasks.com"
