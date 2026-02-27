from django.db import models
from exhibitions.models import *

class Payment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Successful', 'Successful'),
        ('Failed', 'Failed'),
    ]

    registration = models.OneToOneField(ExhibitorRegistration, on_delete=models.CASCADE, related_name='payment_record')
    
    razorpay_order_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount in INR")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    
    receipt_pdf = models.FileField(upload_to='receipts/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment for {self.registration.company_name} - {self.status}"