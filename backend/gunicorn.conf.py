# Gunicorn configuration for Render free tier
workers = 2
timeout = 120        # seconds — allows slow cold-start SMTP connections
graceful_timeout = 30
keepalive = 5
# Note: bind is set by Render via the start command ($PORT)
