# Gunicorn configuration for Render free tier
workers = 2
timeout = 120        # seconds — allows slow cold-start SMTP connections
graceful_timeout = 30
keepalive = 5
bind = "0.0.0.0:8000"
