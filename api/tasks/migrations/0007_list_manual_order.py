from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0006_alter_task_created_alter_task_text_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="list",
            name="manual_order",
            field=models.JSONField(default=list),
        ),
    ]
