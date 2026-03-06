from django.urls import path
from .views import (
    CreateOrderView, VerifyPaymentView, RazorpayWebhookView,
    GenerateUpiQRView, SubmitUpiPaymentView,
)

urlpatterns = [
    # Razorpay (existing)
    path('create_order',    CreateOrderView.as_view(),    name='create_order'),
    path('verify_payment',  VerifyPaymentView.as_view(),  name='verify_payment'),
    path('webhook',         RazorpayWebhookView.as_view(), name='webhook'),
    # UPI QR (new)
    path('generate_upi_qr',     GenerateUpiQRView.as_view(),    name='generate_upi_qr'),
    path('submit_upi_payment',  SubmitUpiPaymentView.as_view(), name='submit_upi_payment'),
]