# Generated manually for admin module extensions.

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='clinic',
            name='timezone',
            field=models.CharField(default='Africa/Tunis', max_length=64),
        ),
        migrations.AddField(
            model_name='clinicsettings',
            name='emergency_priority_rules',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='user',
            name='force_password_change',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='AdminAuditLog',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('actor_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('action_type', models.CharField(max_length=100)),
                ('entity_type', models.CharField(max_length=100)),
                ('entity_id', models.CharField(blank=True, max_length=64, null=True)),
                ('before_data', models.JSONField(blank=True, null=True)),
                ('after_data', models.JSONField(blank=True, null=True)),
                ('metadata', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('actor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='admin_audit_actions', to=settings.AUTH_USER_MODEL)),
                ('clinic', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='audit_logs', to='core.clinic')),
            ],
            options={
                'db_table': 'admin_audit_logs',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='SystemSettings',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('twilio_config', models.JSONField(blank=True, default=dict)),
                ('smtp_config', models.JSONField(blank=True, default=dict)),
                ('sms_template', models.TextField(default='Your ticket {ticket_number} has been updated.')),
                ('email_template', models.TextField(default='Hello {patient_name}, your queue update is ready.')),
                ('default_queue_rules', models.JSONField(blank=True, default=dict)),
                ('maintenance_mode', models.BooleanField(default=False)),
                ('maintenance_banner', models.CharField(blank=True, default='', max_length=255)),
                ('data_retention_days', models.IntegerField(default=90)),
                ('allowed_countries', models.JSONField(blank=True, default=list)),
                ('allowed_phone_formats', models.JSONField(blank=True, default=list)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='updated_system_settings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'system_settings',
            },
        ),
        migrations.AddIndex(
            model_name='adminauditlog',
            index=models.Index(fields=['created_at'], name='idx_admin_audit_created_at'),
        ),
        migrations.AddIndex(
            model_name='adminauditlog',
            index=models.Index(fields=['action_type'], name='idx_admin_audit_action_type'),
        ),
    ]
