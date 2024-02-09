import pytest
from accounts.models import CustomUser


@pytest.mark.django_db
def test_create_task(client):
    # Going to add fixtures, but POC for now
    user = CustomUser.objects.create(
        email="alice@numbattasks.com",
        first_name="Alice",
        last_name="Numbat",
    )
    client.force_login(user)
    client.post("/api/tasks/", data={"text": "Do the washing"})
    response = client.get("/api/tasks/")
    assert response.json()[0]["id"] == 1
    assert response.json()[0]["text"] == "Do the washing"
    assert response.json()[0]["complete"] is False
