from django.db import models
from tasks.utils import truncate


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
    active = models.BooleanField(null=False, blank=False, default=True)

    def __str__(self):
        return truncate(self.name)


class Task(models.Model):
    id = models.BigAutoField(primary_key=True, db_index=True)
    list = models.ForeignKey(List, on_delete=models.CASCADE, null=False, blank=False)
    created = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    updated = models.DateTimeField(auto_now=True, null=False, blank=False)
    text = models.CharField(max_length=256, null=False, blank=True)
    complete = models.BooleanField(null=False, blank=False, default=False)

    @property
    def text_summary(self):
        return truncate(self.text)
