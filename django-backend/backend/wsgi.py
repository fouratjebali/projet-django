"""
WSGI config for the QueueLess backend project.

This exposes the WSGI callable as a module‑level variable named
``application``. It is used by Django's development server and can
also serve as the entry point for production WSGI servers like
Gunicorn or uWSGI.
"""

import os

from django.core.wsgi import get_wsgi_application  # type: ignore


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()