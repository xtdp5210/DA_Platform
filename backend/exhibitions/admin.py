from django.contrib import admin, messages
from django.utils.html import format_html
from .models import *
from .email_utils import send_approval_email, send_rejection_email


# ── Admin Actions ───────────────────────────────────────────────────────────────

@admin.action(description="✅ Approve selected registrations & notify companies")
def approve_registrations(modeladmin, request, queryset):
    updated = 0
    for reg in queryset.exclude(approval_status='approved'):
        reg.approval_status = 'approved'
        reg.save(update_fields=['approval_status'])
        try:
            send_approval_email(reg)
        except Exception as exc:
            modeladmin.message_user(request, f"Email failed for {reg.company_name}: {exc}", messages.WARNING)
        updated += 1
    modeladmin.message_user(request, f"{updated} registration(s) approved and companies notified.", messages.SUCCESS)


@admin.action(description="✗ Reject selected registrations & notify companies")
def reject_registrations(modeladmin, request, queryset):
    updated = 0
    for reg in queryset.exclude(approval_status='rejected'):
        reg.approval_status = 'rejected'
        reg.save(update_fields=['approval_status'])
        try:
            send_rejection_email(reg, reason=reg.rejection_reason or "")
        except Exception as exc:
            modeladmin.message_user(request, f"Email failed for {reg.company_name}: {exc}", messages.WARNING)
        updated += 1
    modeladmin.message_user(request, f"{updated} registration(s) rejected and companies notified.", messages.SUCCESS)


# ── Stall Admin ─────────────────────────────────────────────────────────────────

@admin.register(Stall)
class StallAdmin(admin.ModelAdmin):
    list_display = ('stall_number', 'block', 'size', 'price', 'status')
    list_filter = ('status',)
    search_fields = ('stall_number',)
    list_editable = ('status', 'price')


# ── Exhibitor Registration Admin ────────────────────────────────────────────────

@admin.register(ExhibitorRegistration)
class ExhibitorRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        'company_name', 'stall', 'representative_name',
        'approval_status_badge', 'payment_status', 'created_at',
    )
    list_filter = ('approval_status', 'payment_status', 'created_at')
    search_fields = ('company_name', 'representative_name', 'contact_email', 'stall__stall_number')
    readonly_fields = ('created_at', 'payment_status')
    actions = [approve_registrations, reject_registrations]

    fieldsets = (
        ("Company Information", {
            'fields': (
                'user', 'company_name', 'sector',
                'representative_name', 'contact_email', 'contact_phone',
                'company_profile_link',
            )
        }),
        ("Exhibition Details", {
            'fields': ('stall', 'products_featuring', 'additional_support'),
        }),
        ("Review & Approval", {
            'fields': ('approval_status', 'rejection_reason'),
            'description': (
                "Change <strong>Approval Status</strong> here and save — "
                "the company will NOT automatically receive an email when you save this form. "
                "Use the <strong>list-view actions</strong> (✅ Approve / ✗ Reject) to "
                "approve/reject AND send notification emails simultaneously."
            ),
        }),
        ("Payment", {
            'fields': ('payment_status', 'created_at'),
        }),
    )

    def approval_status_badge(self, obj):
        colours = {
            'pending_review': ('#b45309', '#FFF7ED', '⏳'),
            'approved':       ('#16a34a', '#F0FDF4', '✅'),
            'rejected':       ('#dc2626', '#FEF2F2', '✗'),
        }
        colour, bg, icon = colours.get(obj.approval_status, ('#6b7280', '#f9fafb', '?'))
        return format_html(
            '<span style="background:{};color:{};padding:3px 10px;border-radius:12px;'
            'font-size:11px;font-weight:700;">{} {}</span>',
            bg, colour, icon, obj.get_approval_status_display()
        )
    approval_status_badge.short_description = "Approval"
    approval_status_badge.admin_order_field = "approval_status"
