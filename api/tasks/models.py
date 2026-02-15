from django.db import models
from jsonschema import validate

from tasks.utils import truncate


def validate_manual_order(value):
    schema = {
        "type": "array",
        "items": {"type": "integer"},
        "minItems": 0,
    }
    validate(instance=value, schema=schema)


class SortOrder(models.TextChoices):
    TEXT_ASCENDING = "text"
    TEXT_DESCENDING = "-text"
    CREATED_ASCENDING = "created"
    CREATED_DESCENDING = "-created"
    UPDATED_ASCENDING = "updated"
    UPDATED_DESCENDING = "-updated"
    MANUAL = "manual"


class List(models.Model):
    id = models.BigAutoField(primary_key=True, db_index=True)
    owner = models.ForeignKey(
        "accounts.CustomUser",
        on_delete=models.CASCADE,
        related_name="lists",
    )
    created = models.DateTimeField(auto_now_add=True, db_index=True)
    updated = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=256, blank=True)
    pinned = models.BooleanField(default=False, db_index=True)
    sort_order = models.CharField(
        max_length=20,
        choices=SortOrder,
        default=SortOrder.CREATED_ASCENDING,
    )
    manual_order = models.JSONField(
        default=list, blank=True, validators=[validate_manual_order]
    )
    archived = models.BooleanField(default=False)

    def __str__(self):
        return truncate(self.name)


class Task(models.Model):
    id = models.BigAutoField(primary_key=True, db_index=True)
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name="tasks")
    created = models.DateTimeField(auto_now_add=True, db_index=True)
    updated = models.DateTimeField(auto_now=True, db_index=True)
    text = models.CharField(max_length=256, blank=True, db_index=True)
    complete = models.BooleanField(default=False)

    @property
    def text_summary(self):
        return truncate(self.text)


# TODO
#  * URLs (or just post it in the task endpoint?)
#  * Check with the django-debug-toolbar serializer prefetch_related working.
#  * build the front end...


# I debated for a very long time if I should have a separate subtask model
# or just have the existing task model refer to itself. In the end I went with
# a separate model because I could see a future where task have features (e.g.
# due date) that I don't want on sub-tasks. And it feels cleaner. But honestly,
# I'm still not sure if this is the best approach or not.
class SubTask(models.Model):
    id = models.BigAutoField(primary_key=True)
    task = models.ForeignKey(
        "tasks.Task",
        on_delete=models.CASCADE,
        related_name="subtasks",
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    text = models.CharField(max_length=256, blank=True, db_index=True)
    complete = models.BooleanField(default=False)

    @property
    def text_summary(self):
        return truncate(self.text)
