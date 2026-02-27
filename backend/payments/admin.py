from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('get_company_name', 'amount', 'status', 'razorpay_order_id', 'created_at', 'has_receipt')
    list_filter = ('status', 'created_at')
    search_fields = ('registration__company_name', 'razorpay_order_id', 'razorpay_payment_id')
    
    readonly_fields = ('razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'amount', 'created_at', 'updated_at', 'receipt_pdf')

    def get_company_name(self, obj):
        return obj.registration.company_name
    get_company_name.short_description = 'Company'

    def has_receipt(self, obj):
        return bool(obj.receipt_pdf)
    has_receipt.boolean = True
    has_receipt.short_description = 'Receipt Generated?'