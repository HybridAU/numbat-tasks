from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0009_alter_list_owner_alter_task_list"),
    ]

    operations = [
        migrations.AddField(
            model_name="list",
            name="pinned",
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name="list",
            name="created",
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
    ]
