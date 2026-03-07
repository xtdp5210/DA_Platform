from rest_framework import serializers
from django.db import transaction
from .models import *


class StallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stall
        fields = ['id', 'stall_number', 'block', 'size', 'price', 'status']


class ExhibitorRegistrationSerializer(serializers.ModelSerializer):
    stall_id = serializers.PrimaryKeyRelatedField(
        queryset=Stall.objects.filter(status='available'), 
        source='stall', 
        write_only=True,
        error_messages={'does_not_exist': 'This stall is invalid or already booked.'}
    )
    
    stall_details = StallSerializer(source='stall', read_only=True)

    class Meta:
        model = ExhibitorRegistration
        fields = [
            'id', 'stall_id', 'stall_details', 'company_name', 'sector', 
            'representative_name', 'contact_email', 'contact_phone', 
            'company_profile_link', 'products_featuring', 'additional_support',
            'approval_status', 'payment_status', 'created_at'
        ]
        read_only_fields = ['approval_status', 'payment_status', 'created_at']

    MAX_STALLS_PER_USER = 2

    def create(self, validated_data):
        user = self.context['request'].user

        # Enforce maximum stall limit per user
        existing_count = ExhibitorRegistration.objects.filter(user=user).count()
        if existing_count >= self.MAX_STALLS_PER_USER:
            raise serializers.ValidationError(
                {'stall_id': f'You can register for a maximum of {self.MAX_STALLS_PER_USER} stalls.'}
            )

        # Use atomic + select_for_update to eliminate the race condition where
        # two concurrent requests could both pass the "available" queryset check
        # and end up booking the same stall.
        with transaction.atomic():
            stall = Stall.objects.select_for_update().get(pk=validated_data['stall'].pk)

            if stall.status != 'available':
                raise serializers.ValidationError(
                    {'stall_id': 'This stall is invalid or already booked.'}
                )

            registration = ExhibitorRegistration.objects.create(user=user, **validated_data)

            stall.status = 'pending'
            stall.save()

        return registration
    
class MyBookingsSerializer(serializers.ModelSerializer):
    stall_number = serializers.CharField(source='stall.stall_number', read_only=True)
    block = serializers.CharField(source='stall.block', read_only=True)
    stall_price = serializers.DecimalField(source='stall.price', max_digits=10, decimal_places=2, read_only=True)
    receipt_url = serializers.SerializerMethodField()
    payment_deadline = serializers.SerializerMethodField()

    class Meta:
        model = ExhibitorRegistration
        fields = [
            'id', 'company_name', 'stall_number', 'block', 'stall_price',
            'approval_status', 'payment_status', 'created_at',
            'approved_at', 'payment_deadline', 'receipt_url',
        ]

    def get_receipt_url(self, obj):
        if hasattr(obj, 'payment_record') and obj.payment_record.receipt_pdf:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.payment_record.receipt_pdf.url)
        return None

    def get_payment_deadline(self, obj):
        deadline = obj.payment_deadline
        return deadline.isoformat() if deadline else None