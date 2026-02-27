from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, CompanyProfile, OTPVerification

class CompanyProfileInline(admin.StackedInline):
    model = CompanyProfile
    can_delete = False
    verbose_name_plural = 'Company Profile Details'
    fk_name = 'user'

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'is_email_verified', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_email_verified', 'is_staff', 'is_active')
    search_fields = ('email',)
    ordering = ('-date_joined',)
    
    inlines = (CompanyProfileInline,)

    fieldsets = (
        ('Login Credentials', {'fields': ('email', 'password')}),
        ('Verification Status', {'fields': ('is_email_verified',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'is_email_verified', 'is_staff', 'is_active')}
        ),
    )

@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'representative_name', 'phone_number', 'created_at')
    search_fields = ('company_name', 'representative_name', 'user__email', 'phone_number')
    list_filter = ('created_at',)
    ordering = ('-created_at',)

@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp_code', 'created_at', 'expires_at', 'is_currently_valid')
    search_fields = ('user__email', 'otp_code')
    readonly_fields = ('created_at',)
    
    def is_currently_valid(self, obj):
        return obj.is_valid()
    
    is_currently_valid.boolean = True
    is_currently_valid.short_description = "Is Valid Now?"