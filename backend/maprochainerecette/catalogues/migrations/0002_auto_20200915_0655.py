# Generated by Django 3.0.8 on 2020-09-15 06:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('catalogues', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='categorie',
            old_name='nom',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='ingredient',
            old_name='nom',
            new_name='name',
        ),
    ]
