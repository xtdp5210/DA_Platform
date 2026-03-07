import logging
from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Stall, ExhibitorRegistration
from .serializers import StallSerializer, ExhibitorRegistrationSerializer, MyBookingsSerializer
from .email_utils import send_submission_received_email, send_deadline_expired_email

logger = logging.getLogger(__name__)


# ── Helper: release stalls whose 24-hour payment window has elapsed ──────────
def release_expired_stalls() -> int:
    """Find approved-but-unpaid registrations past their 24-hour payment
    deadline, expire them, and free the stalls back to 'available'.
    Returns the number of registrations expired.
    """
    now = timezone.now()
    cutoff = now - timedelta(hours=ExhibitorRegistration.PAYMENT_DEADLINE_HOURS)

    expired_regs = (
        ExhibitorRegistration.objects
        .select_related('stall', 'user')
        .filter(
            approval_status='approved',
            payment_status='unpaid',
            approved_at__isnull=False,
            approved_at__lte=cutoff,
        )
    )

    count = 0
    for reg in expired_regs:
        with transaction.atomic():
            # Mark the registration as expired
            reg.approval_status = 'expired'
            reg.save(update_fields=['approval_status'])

            # Free the stall
            stall = Stall.objects.select_for_update().get(pk=reg.stall_id)
            stall.status = 'available'
            stall.save(update_fields=['status'])

        # Fire expiry notification (non-fatal)
        try:
            send_deadline_expired_email(reg)
        except Exception as exc:
            logger.error("Expiry email failed for REG#%s: %s", reg.pk, exc)

        count += 1
        logger.info("Released expired stall %s (REG#%s)", reg.stall, reg.pk)

    return count


# ── Cron endpoint — called by cron-job.org every ~15 min ─────────────────────
class ReleaseExpiredStallsView(APIView):
    """Public, lightweight endpoint that triggers the expiry sweep.
    Returns JSON with the number of stalls released.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        released = release_expired_stalls()
        return Response({"released": released})


# ── Existing views ───────────────────────────────────────────────────────────

class AvailableStallsView(generics.ListAPIView):
    serializer_class = StallSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Eagerly release expired stalls so the list is always accurate
        release_expired_stalls()
        return Stall.objects.filter(status='available').order_by('block', 'stall_number')


class RegisterExhibitorView(generics.CreateAPIView):
    serializer_class = ExhibitorRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # After successful creation, fire the submission confirmation email
        if response.status_code == 201:
            try:
                registration_id = response.data.get('id')
                registration = ExhibitorRegistration.objects.select_related('stall', 'user').get(pk=registration_id)
                send_submission_received_email(registration)
            except Exception as exc:
                logger.error("Submission email failed: %s", exc)
        return response


class MyBookingsView(generics.ListAPIView):
    serializer_class = MyBookingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Eagerly release any expired stalls before returning results
        release_expired_stalls()
        return (
            ExhibitorRegistration.objects
            .filter(user=self.request.user)
            .select_related('stall')   # avoid N+1 for stall_number/block/price
            .order_by('-created_at')
        )
