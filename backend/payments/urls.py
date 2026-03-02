from django.urls import path
from .views import CreateOrderView, VerifyPaymentView, RazorpayWebhookView

urlpatterns = [
    path('create_order', CreateOrderView.as_view(), name='create_order'),
    path('verify_payment', VerifyPaymentView.as_view(), name='verify_payment'),
    path('webhook', RazorpayWebhookView.as_view(), name='webhook'),
]