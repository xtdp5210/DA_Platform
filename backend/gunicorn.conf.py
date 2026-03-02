# Gunicorn configuration for Render free tier
import os

workers = 2
timeout = 120        # seconds — allows slow cold-start SMTP connections
graceful_timeout = 30
keepalive = 5
# bind is set by the start command via $PORT
