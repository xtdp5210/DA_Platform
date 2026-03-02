#!/usr/bin/env bash
# Render build script — runs once on every deploy before the server starts.
set -o errexit   # Exit immediately if any command fails

pip install --upgrade pip
pip install -r requirements.txt

# Collect static files so WhiteNoise can serve them
python manage.py collectstatic --no-input

# Apply any pending database migrations (also triggers the site/socialapp data migration)
python manage.py migrate --no-input

# Create superuser non-interactively from env vars (safe to run on every deploy —
# the --noinput flag skips if the account already exists via a try/except inside Django).
# Set DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD in Render → Environment.
if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='$DJANGO_SUPERUSER_EMAIL').exists():
    User.objects.create_superuser(email='$DJANGO_SUPERUSER_EMAIL', password='$DJANGO_SUPERUSER_PASSWORD')
    print('Superuser created.')
else:
    print('Superuser already exists — skipped.')
"
fi
