from django.db import migrations, models


def collapse_staff_roles(apps, schema_editor):
    User = apps.get_model('core', 'User')
    User.objects.filter(role__in=['DOCTOR', 'NURSE', 'RECEPTIONIST']).update(role='STAFF')
    User.objects.filter(email='dr.sarah@metrocare.tn').update(email='staff.sarah@metrocare.tn')


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_admin_module'),
    ]

    operations = [
        migrations.RunPython(collapse_staff_roles, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(
                choices=[('ADMIN', 'Admin'), ('STAFF', 'Staff')],
                default='STAFF',
                max_length=20,
            ),
        ),
    ]
