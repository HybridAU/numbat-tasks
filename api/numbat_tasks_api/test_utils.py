import random
import string

from accounts.models import CustomUser
from tasks.models import List, Task


def generate_base_data(client):
    """
    To make the setup of most tests easier, we create two base users:
     * Alice the admin (superuser);
     * Bob, a regular user

    Each with 2 lists, and 5 tasks, (2 complete, 3 pending)
    """
    data = {
        "alice": {
            "email": "alice@numbat-tasks.com",
            "first_name": "Alice",
            "last_name": "Numbat",
            "password": "".join(
                random.choices(string.ascii_letters + string.digits, k=18)
            ),
        },
        "bob": {
            "email": "bob@numbat-tasks.com",
            "first_name": "Alice",
            "last_name": "Numbat",
            "password": "".join(
                random.choices(string.ascii_letters + string.digits, k=18)
            ),
        },
    }
    # Create and login for both users
    alice = CustomUser.objects.create(**data["alice"])
    alice.is_superuser = True
    alice.clean()
    alice.save()
    data["alice"]["id"] = alice.id
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
    data["bob"]["id"] = bob.id
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
