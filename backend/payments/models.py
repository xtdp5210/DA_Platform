from django.db import models
from django.contrib.auth import get_user_model
from exhibitions.models import *

User = get_user_model()


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


class UpiPaymentSubmission(models.Model):
    """
    Tracks a UPI/bank-transfer payment submitted by an exhibitor.
    The accounts department verifies the UTR/reference number against bank
    statement and marks `is_verified = True` via the admin action, which
    automatically confirms the stall booking.
    """
    registration = models.OneToOneField(
        ExhibitorRegistration,
        on_delete=models.CASCADE,
        related_name='upi_payment',
    )
    amount = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Amount in INR — auto-filled from stall price, cannot be manipulated by user.",
    )
    utr_number = models.CharField(
        max_length=100,
        help_text="UTR / Transaction Reference Number provided by the payer after transfer.",
    )
    payer_upi_id = models.CharField(
        max_length=255, blank=True,
        help_text="Optional: payer's UPI ID or bank account (for cross-check).",
    )
    transaction_note = models.CharField(
        max_length=255, blank=True,
        help_text="Transaction note embedded in the QR (contains HMAC token — do NOT edit).",
    )

    is_verified = models.BooleanField(
        default=False,
        help_text="Set True via admin action after verifying UTR in bank statement.",
    )
    verified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='upi_verifications',
        help_text="Staff member who verified the payment.",
    )
    verified_at = models.DateTimeField(null=True, blank=True)

    admin_notes = models.TextField(
        blank=True,
        help_text="Internal notes for the accounts department (e.g. discrepancy, duplicate).",
    )

    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "UPI Payment Submission"
        verbose_name_plural = "UPI Payment Submissions"
        ordering = ['-submitted_at']

    def __str__(self):
        status = "✅ Verified" if self.is_verified else "⏳ Pending"
        return f"[{status}] {self.registration.company_name} | ₹{self.amount} | UTR: {self.utr_number}"