from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Stall, ExhibitorRegistration
from .serializers import StallSerializer, ExhibitorRegistrationSerializer, MyBookingsSerializer
from .email_utils import send_submission_received_email


class AvailableStallsView(generics.ListAPIView):
    queryset = Stall.objects.filter(status='available').order_by('block', 'stall_number')
    serializer_class = StallSerializer
    permission_classes = [permissions.AllowAny]


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
                # Non-fatal — log but still return 201
                import logging
                logging.getLogger(__name__).error("Submission email failed: %s", exc)
        return response


class MyBookingsView(generics.ListAPIView):
    serializer_class = MyBookingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExhibitorRegistration.objects.filter(user=self.request.user).order_by('-created_at')
