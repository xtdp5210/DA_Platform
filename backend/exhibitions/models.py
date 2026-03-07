from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Stall(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('pending', 'Pending Payment'),
        ('booked', 'Booked'),
    ]

    BLOCK_CHOICES = [
        ('A', 'Block A'),
        ('B', 'Block B'),
        ('C', 'Block C'),
        ('D', 'Block D'),
    ]

    stall_number = models.CharField(max_length=10, unique=True)
    block = models.CharField(max_length=1, choices=BLOCK_CHOICES, blank=True, null=True)
    size = models.CharField(max_length=50, default="3x3 Mtr.")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')

    def __str__(self):
        return f"Stall {self.stall_number} ({self.get_status_display()})"


class ExhibitorRegistration(models.Model):
    PAYMENT_STATUS = [
        ('unpaid', 'Unpaid'),
        ('processing', 'Processing'),
        ('paid', 'Paid'),
    ]

    APPROVAL_STATUS = [
        ('pending_review', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired — Payment Deadline Missed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exhibition_bookings')
    stall = models.ForeignKey(Stall, on_delete=models.PROTECT, related_name='booking')

    company_name = models.CharField(max_length=255)
    
    sector = models.CharField(max_length=255)
    
    representative_name = models.CharField(max_length=255)
    
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    
    company_profile_link = models.URLField(blank=True, null=True)
    
    products_featuring = models.TextField()
    
    additional_support = models.TextField(blank=True, null=True)

    approval_status = models.CharField(
        max_length=20,
        choices=APPROVAL_STATUS,
        default='pending_review',
        db_index=True,
    )
    rejection_reason = models.TextField(blank=True, null=True, help_text="Reason for rejection (visible in email to company)")

    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='unpaid')
    approved_at = models.DateTimeField(null=True, blank=True, help_text="Set automatically when admin approves. Payment deadline = approved_at + 24 h.")
    created_at = models.DateTimeField(auto_now_add=True)

    PAYMENT_DEADLINE_HOURS = 24

    @property
    def payment_deadline(self):
        """Return the datetime by which payment must be completed, or None."""
        if self.approved_at:
            from datetime import timedelta
            return self.approved_at + timedelta(hours=self.PAYMENT_DEADLINE_HOURS)
        return None

    @property
    def is_payment_expired(self):
        """True if approved but unpaid and past the 24-hour deadline."""
        from django.utils import timezone
        deadline = self.payment_deadline
        return (
            deadline is not None
            and self.payment_status == 'unpaid'
            and timezone.now() > deadline
        )

    def __str__(self):
        return f"{self.company_name} - {self.stall.stall_number}"