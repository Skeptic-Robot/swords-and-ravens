# Generated by Django 3.0.2 on 2020-04-29 09:30
from django.conf import settings
from django.db import migrations, models

from agotboardgame_main.models import User


def forward(apps, schema_editor):
    # Create a Vanilla forum account for all registered user
    for user in User.objects.all():
        if str(user.id) not in settings.VANILLA_IGNORED_USERS_WHEN_MIGRATING and user.vanilla_forum_user_id == 0:
            # The function was removed since the Vanilla forum integration was
            # not kept.
            pass


def reverse(apps, schema_editor):
    # Too lazy to actually code this, no-one's gonna use it anyway.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('agotboardgame_main', '0013_user_email_notification_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='vanilla_forum_user_id',
            field=models.IntegerField(default=0),
        ),
        migrations.RunPython(forward, reverse)
    ]