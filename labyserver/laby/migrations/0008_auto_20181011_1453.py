# Generated by Django 2.1.2 on 2018-10-11 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('laby', '0007_auto_20181011_1347'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rounds',
            name='last_active',
            field=models.IntegerField(default=0, verbose_name='Last player'),
        ),
        migrations.AlterField(
            model_name='rounds',
            name='round_number',
            field=models.IntegerField(default=1, verbose_name='Round number'),
        ),
    ]
