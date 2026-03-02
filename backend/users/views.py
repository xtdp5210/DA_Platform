from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.utils.crypto import get_random_string
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import logging
import hmac
import threading
import sys

security_logger = logging.getLogger('backend')

from .serializers import *
from .models import *

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    throttle_classes = [AnonRateThrottle] 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        otp = user.otp_verification.generate_otp()

        try:
            send_mail(
                subject="Verify your Defense Tech Exhibition Account",
                message=f"Your verification code is: {otp}. It will expire in 3 minutes.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            security_logger.warning("OTP email sent to %s", user.email)
        except Exception as e:
            security_logger.error("SMTP FAILED for %s: %s", user.email, e)
            print(f"SMTP FAILED (register): {e}", file=sys.stderr, flush=True)

        return Response({
            "message": "Registration successful. Please check your email for the OTP.",
            "email": user.email
        }, status=status.HTTP_201_CREATED)


class VerifyOTPView(views.APIView):
    throttle_classes = [AnonRateThrottle] 

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid email or OTP."}, status=status.HTTP_400_BAD_REQUEST)

            if user.is_email_verified:
                return Response({"message": "Account is already verified."}, status=status.HTTP_400_BAD_REQUEST)

            otp_record = user.otp_verification

            if otp_record.is_valid() and hmac.compare_digest(otp_record.otp_code or '', otp_code):
                
                user.is_email_verified = True
                user.save()
                
                otp_record.clear_otp()

                tokens = get_tokens_for_user(user)

                return Response({
                    "message": "Email verified successfully. You are now logged in.",
                    "tokens": tokens
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProfileView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginAPIView(views.APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        token = request.data.get('id_token')
        
        if not token:
            return Response({"error": "Google id_token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = User.objects.create_user(
                    email=email,
                    password=get_random_string(32) 
                )
                
                user.is_email_verified = True 
                user.save()

                if hasattr(user, 'company_profile'):
                    profile = user.company_profile
                    profile.representative_name = f"{first_name} {last_name}".strip()
                    profile.save()

            tokens = get_tokens_for_user(user)

            return Response({
                "message": "Google Login successful.",
                "tokens": tokens,
                "email": user.email
            }, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Invalid or expired Google token."}, status=status.HTTP_401_UNAUTHORIZED)


class LoginView(views.APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(request, email=email, password=password)

            if user is not None:
                if not user.is_email_verified:
                    return Response({"error": "Please verify your email via OTP before logging in."}, status=status.HTTP_403_FORBIDDEN)
                
                tokens = get_tokens_for_user(user)
                return Response({
                    "message": "Login successful.",
                    "tokens": tokens
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                security_logger.warning('Failed password change attempt for user: %s', request.user.email)
                return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                validate_password(new_password, user=user)
            except ValidationError as e:
                return Response({"error": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(views.APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']

            try:
                user = User.objects.get(email=email)
                
                otp = user.otp_verification.generate_otp()

                try:
                    send_mail(
                        subject="Password Reset Code",
                        message=f"Your password reset code is: {otp}. It will expire in 3 minutes.",
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False,
                    )
                    security_logger.warning("Reset OTP sent to %s", user.email)
                except Exception as exc:
                    security_logger.error("SMTP FAILED (reset) for %s: %s", user.email, exc)
                    print(f"SMTP FAILED (reset): {exc}", file=sys.stderr, flush=True)
            except User.DoesNotExist:
                pass 

            return Response({"message": "If an account with that email exists, an OTP has been sent."}, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(views.APIView):
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            new_password = serializer.validated_data['new_password']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)

            otp_record = user.otp_verification

            if otp_record.is_valid() and hmac.compare_digest(otp_record.otp_code or '', otp_code):
                try:
                    validate_password(new_password, user=user)
                except ValidationError as e:
                    return Response({"error": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

                user.set_password(new_password)
                user.save()
                
                otp_record.clear_otp()
                
                return Response({"message": "Password reset successfully. You can now log in."}, status=status.HTTP_200_OK)
            else:
                security_logger.warning('Invalid OTP for password reset: %s', email)
                return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(views.APIView):
    """Re-send a fresh OTP to the user's email for account verification.
    Throttled to prevent OTP-spam / enumeration abuse."""
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Always return the same response — never confirm whether an account exists
        try:
            user = User.objects.get(email=email)

            if user.is_email_verified:
                return Response({"message": "Account is already verified. Please log in."}, status=status.HTTP_200_OK)

            otp = user.otp_verification.generate_otp()

            try:
                send_mail(
                    subject="Your New Verification Code",
                    message=f"Your new verification code is: {otp}. It will expire in 3 minutes.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
                security_logger.warning("Resend OTP sent to %s", user.email)
            except Exception as exc:
                security_logger.error("SMTP FAILED (resend) for %s: %s", user.email, exc)
                print(f"SMTP FAILED (resend): {exc}", file=sys.stderr, flush=True)
        except User.DoesNotExist:
            pass  # Silently ignore — no account enumeration

        return Response(
            {"message": "If an unverified account exists for that email, a new OTP has been sent."},
            status=status.HTTP_200_OK
        )


class EmailTestView(views.APIView):
    """Admin-only endpoint to verify SMTP is working on the live server.
    POST /users/email-test/ with {"to": "you@example.com"}
    Returns success or the exact SMTP error message."""
    permission_classes = [IsAdminUser]

    def post(self, request):
        to = request.data.get('to', '').strip()
        if not to:
            return Response({"error": "Provide a 'to' email address."}, status=status.HTTP_400_BAD_REQUEST)

        config = {
            "EMAIL_HOST": settings.EMAIL_HOST,
            "EMAIL_PORT": settings.EMAIL_PORT,
            "EMAIL_HOST_USER": settings.EMAIL_HOST_USER or "(empty)",
            "DEFAULT_FROM_EMAIL": settings.DEFAULT_FROM_EMAIL or "(empty)",
            "EMAIL_USE_TLS": settings.EMAIL_USE_TLS,
            "EMAIL_TIMEOUT": getattr(settings, 'EMAIL_TIMEOUT', None),
        }

        try:
            send_mail(
                subject="DA Platform — SMTP Test",
                message="This is a test email from your Render deployment.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[to],
                fail_silently=False,
            )
            return Response({"status": "sent", "config": config})
        except Exception as e:
            return Response({"status": "failed", "error": str(e), "config": config}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)