from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterUserView,
    LoginView,
    GoogleLoginAPIView,
    VerifyOTPView,
    ResendOTPView,
    ProfileView,
    ChangePasswordView,
    ForgotPasswordView,
    ResetPasswordView,
)

urlpatterns = [
    path('register', RegisterUserView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('google_login', GoogleLoginAPIView.as_view(), name='google_login'),
    path('verify_otp', VerifyOTPView.as_view(), name='verify_otp'),
    path('resend_otp', ResendOTPView.as_view(), name='resend_otp'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('profile', ProfileView.as_view(), name='profile'),

    path('change_password', ChangePasswordView.as_view(), name='change_password'),
    path('forgot_password', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset_password', ResetPasswordView.as_view(), name='reset_password'),
]