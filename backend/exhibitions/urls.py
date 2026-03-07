from django.urls import path
from .views import AvailableStallsView, RegisterExhibitorView, MyBookingsView, ReleaseExpiredStallsView

urlpatterns = [
    path('available_stalls', AvailableStallsView.as_view(), name='available_stalls'),
    path('register_exhibitor', RegisterExhibitorView.as_view(), name='register_exhibitor'),
    path('my_bookings', MyBookingsView.as_view(), name='my_bookings'),
    path('release_expired', ReleaseExpiredStallsView.as_view(), name='release_expired'),
]