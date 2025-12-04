from django.db import migrations, models

import tasks.models


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0007_list_manual_order"),
    ]

    operations = [
        migrations.AlterField(
            model_name="list",
            name="manual_order",
            field=models.JSONField(
                blank=True,
                default=list,
                validators=[tasks.models.validate_manual_order],
            ),
        ),
    ]
