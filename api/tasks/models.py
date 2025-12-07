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
        null=False,
        blank=False,
    )
    created = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    updated = models.DateTimeField(auto_now=True, null=False, blank=False)
    name = models.CharField(max_length=256, null=False, blank=True)
    sort_order = models.CharField(
        max_length=20,
        choices=SortOrder,
        default=SortOrder.CREATED_ASCENDING,
        null=False,
        blank=False,
    )
    manual_order = models.JSONField(
        default=list, blank=True, null=False, validators=[validate_manual_order]
    )
    archived = models.BooleanField(null=False, blank=False, default=False)

    def __str__(self):
        return truncate(self.name)


class Task(models.Model):
    id = models.BigAutoField(primary_key=True, db_index=True)
    list = models.ForeignKey(List, on_delete=models.CASCADE, null=False, blank=False)
    created = models.DateTimeField(
        auto_now_add=True,
        null=False,
        blank=False,
        db_index=True,
    )
    updated = models.DateTimeField(
        auto_now=True,
        null=False,
        blank=False,
        db_index=True,
    )
    text = models.CharField(max_length=256, null=False, blank=True, db_index=True)
    complete = models.BooleanField(null=False, blank=False, default=False)

    @property
    def text_summary(self):
        return truncate(self.text)
