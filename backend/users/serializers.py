from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .models import *

User = get_user_model()

class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['company_name', 'representative_name', 'phone_number']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    company_name = serializers.CharField(source='company_profile.company_name', required=False, allow_blank=True)
    representative_name = serializers.CharField(source='company_profile.representative_name', required=False, allow_blank=True)
    phone_number = serializers.CharField(source='company_profile.phone_number', required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'company_name', 'representative_name', 'phone_number']

    def create(self, validated_data):
        profile_data = validated_data.pop('company_profile', {})
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        profile = user.company_profile
        profile.company_name = profile_data.get('company_name', '')
        profile.representative_name = profile_data.get('representative_name', '')
        profile.phone_number = profile_data.get('phone_number', '')
        profile.save()
        
        return user


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)