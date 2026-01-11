# I used to have "Active" (i.e. true if you want to see it)
# but I've flipped it to "Archived" (i.e. true if you want to hide it)
# so 1st rename the field (migration 0002), then invert it.

from django.db import migrations
from django.db.models.expressions import F


def invert_archived(apps, _schema_editor):
    lists = apps.get_model("tasks", "List")
    lists.objects.all().update(archived=~F("archived"))


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0002_rename_active_list_archived"),
    ]

    operations = [
        migrations.RunPython(
            invert_archived,
            # Because we are flipping the boolean, the reverse code is exactly the same as the forward code.
            reverse_code=invert_archived,
        )
    ]
