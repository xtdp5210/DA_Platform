from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
import secrets
from datetime import timedelta


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    is_email_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class CompanyProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=255, blank=True, null=True)
    representative_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True) 
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name or f"Profile for {self.user.email}"

class OTPVerification(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='otp_verification')
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    def generate_otp(self):
        # secrets.randbelow is cryptographically secure (unlike random.randint)
        self.otp_code = str(secrets.randbelow(900000) + 100000)
        self.created_at = timezone.now()
        self.expires_at = self.created_at + timedelta(minutes=3)
        self.save()
        return self.otp_code

    def is_valid(self):
        if not self.otp_code or not self.expires_at:
            return False
            
        if timezone.now() > self.expires_at:
            self.otp_code = None
            self.expires_at = None
            self.save()
            return False
            
        return True
    
    def clear_otp(self):
        self.otp_code = None
        self.expires_at = None
        self.save()

    def __str__(self):
        return f"OTP for {self.user.email}"

@receiver(post_save, sender=CustomUser)
def create_user_related_models(sender, instance, created, **kwargs):
    if created:
        CompanyProfile.objects.create(user=instance)
        OTPVerification.objects.create(user=instance)

@receiver(post_save, sender=CustomUser)
def save_user_related_models(sender, instance, **kwargs):
    if hasattr(instance, 'company_profile'):
        instance.company_profile.save()
    if hasattr(instance, 'otp_verification'):
        instance.otp_verification.save()