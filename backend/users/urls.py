from django.urls import path
from .views import *

urlpatterns = [
    path('register', RegisterUserView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('verify_otp', VerifyOTPView.as_view(), name='verify_otp'),

    path('change_password', ChangePasswordView.as_view(), name='change_password'),
    path('forgot_password', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset_password', ResetPasswordView.as_view(), name='reset_password'),
]