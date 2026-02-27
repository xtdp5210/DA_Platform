from django.contrib import admin
from .models import *

@admin.register(Stall)
class StallAdmin(admin.ModelAdmin):
    list_display = ('stall_number', 'block', 'size', 'price', 'status')
    list_filter = ('status', 'block')
    search_fields = ('stall_number',)
    list_editable = ('status', 'price')

@admin.register(ExhibitorRegistration)
class ExhibitorRegistrationAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'stall', 'representative_name', 'payment_status', 'created_at')
    list_filter = ('payment_status', 'created_at')
    search_fields = ('company_name', 'representative_name', 'contact_email', 'stall__stall_number')
    readonly_fields = ('created_at',)