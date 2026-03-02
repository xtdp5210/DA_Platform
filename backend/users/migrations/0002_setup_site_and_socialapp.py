"""
Data migration — automatically creates:
  1. The django.contrib.sites Site record (required by allauth)
  2. The Google OAuth SocialApp record (required by allauth Google login)

Both are seeded from environment variables so no manual shell work is needed.
This runs automatically as part of `python manage.py migrate` in build.sh.
"""
import os
from django.db import migrations


def setup_site_and_google_socialapp(apps, schema_editor):
    # ── 1. Site record ───────────────────────────────────────────────────────
    Site = apps.get_model('sites', 'Site')

    # Read the primary hostname from ALLOWED_HOSTS env var (first value wins)
    allowed_hosts = os.environ.get('ALLOWED_HOSTS', 'localhost')
    domain = allowed_hosts.split(',')[0].strip()

    site, _ = Site.objects.update_or_create(
        id=1,
        defaults={
            'domain': domain,
            'name': 'DA Platform',
        },
    )

    # ── 2. Google SocialApp ──────────────────────────────────────────────────
    SocialApp = apps.get_model('socialaccount', 'SocialApp')

    client_id = os.environ.get('GOOGLE_CLIENT_ID', '')
    client_secret = os.environ.get('GOOGLE_CLIENT_SECRET', '')

    # Only create / update when credentials are actually configured
    if client_id:
        app, _ = SocialApp.objects.update_or_create(
            provider='google',
            defaults={
                'name': 'Google',
                'client_id': client_id,
                'secret': client_secret,
                'key': '',
            },
        )
        # Attach to site (ManyToMany via through table)
        app.sites.set([site])


def reverse_migration(apps, schema_editor):
    # Safe no-op reverse — we don't want to accidentally delete production data
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('sites', '0002_alter_domain_unique'),
        ('socialaccount', '0006_alter_socialaccount_extra_data'),
    ]

    operations = [
        migrations.RunPython(
            setup_site_and_google_socialapp,
            reverse_code=reverse_migration,
        ),
    ]
