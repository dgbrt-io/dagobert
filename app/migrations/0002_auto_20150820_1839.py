# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='rate',
            old_name='price',
            new_name='last',
        ),
        migrations.AddField(
            model_name='rate',
            name='ask',
            field=models.DecimalField(default=-1, max_digits=19, decimal_places=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='rate',
            name='bid',
            field=models.DecimalField(default='1', max_digits=19, decimal_places=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='rate',
            name='currency',
            field=models.CharField(default=1, max_length=200),
            preserve_default=False,
        ),
    ]
