from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0004_alter_list_archived"),
    ]

    operations = [
        migrations.AddField(
            model_name="list",
            name="sort_order",
            field=models.CharField(
                choices=[
                    ("text", "Text Ascending"),
                    ("-text", "Text Descending"),
                    ("created", "Created Ascending"),
                    ("-created", "Created Descending"),
                    ("updated", "Updated Ascending"),
                    ("-updated", "Updated Descending"),
                    ("manual", "Manual"),
                ],
                default="created",
                max_length=20,
            ),
        ),
    ]
