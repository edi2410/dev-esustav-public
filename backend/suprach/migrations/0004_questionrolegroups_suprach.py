# Generated by Django 4.1 on 2023-11-28 10:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("suprach", "0003_suprach_grading_active_alter_suprach_active"),
    ]

    operations = [
        migrations.AddField(
            model_name="questionrolegroups",
            name="suprach",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                to="suprach.suprach",
            ),
        ),
    ]
