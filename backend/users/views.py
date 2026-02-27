from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.utils.crypto import get_random_string

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
        except Exception as e:
            print(f"Failed to send email: {e}")

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

            if otp_record.is_valid() and otp_record.otp_code == otp_code:
                
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
                return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
            
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
                
                send_mail(
                    subject="Password Reset Code",
                    message=f"Your password reset code is: {otp}. It will expire in 3 minutes.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
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

            if otp_record.is_valid() and otp_record.otp_code == otp_code:
                user.set_password(new_password)
                user.save()
                
                otp_record.clear_otp()
                
                return Response({"message": "Password reset successfully. You can now log in."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)