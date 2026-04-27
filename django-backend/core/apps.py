"""
Application configuration for the ``core`` app.

This class registers the app with Django and allows for future
customisation of ready() when signals or checks need to be added.
"""

from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    verbose_name = 'QueueLess Core'