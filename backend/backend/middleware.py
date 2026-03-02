"""
Custom middleware that injects security-related HTTP response headers that
Django does not set natively (Permissions-Policy, Content-Security-Policy).

The header values are read from settings so they stay configurable per
environment without code changes.
"""

from django.conf import settings


class SecurityHeadersMiddleware:
    """Append Permissions-Policy and Content-Security-Policy to every response."""

    def __init__(self, get_response):
        self.get_response = get_response
        self.permissions_policy = getattr(settings, 'PERMISSIONS_POLICY', '')
        self.csp = getattr(settings, 'CONTENT_SECURITY_POLICY', '')

    def __call__(self, request):
        response = self.get_response(request)

        if self.permissions_policy:
            response['Permissions-Policy'] = self.permissions_policy

        if self.csp:
            response['Content-Security-Policy'] = self.csp

        return response
