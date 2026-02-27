from rest_framework import generics, permissions
from .models import *
from .serializers import *


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
    
class MyBookingsView(generics.ListAPIView):
    serializer_class = MyBookingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExhibitorRegistration.objects.filter(user=self.request.user).order_by('-created_at')