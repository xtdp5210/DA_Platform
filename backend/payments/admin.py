from django.contrib import admin, messages
from django.utils import timezone
from django.utils.html import format_html
from django.urls import reverse
from .models import Payment, UpiPaymentSubmission
from exhibitions.models import ExhibitorRegistration


# ── Razorpay Payment Admin ──────────────────────────────────────────────────────

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'get_company_name', 'get_stall', 'get_block',
        'amount_inr', 'status_badge', 'razorpay_order_id', 'created_at',
    )
    list_filter  = ('status', 'created_at')
    search_fields = (
        'registration__company_name', 'razorpay_order_id', 'razorpay_payment_id',
    )
    readonly_fields = (
        'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
        'amount', 'created_at', 'updated_at', 'receipt_pdf',
    )

    def get_company_name(self, obj):
        return obj.registration.company_name
    get_company_name.short_description = 'Company'
    get_company_name.admin_order_field = 'registration__company_name'

    def get_stall(self, obj):
        return obj.registration.stall.stall_number
    get_stall.short_description = 'Stall'

    def get_block(self, obj):
        return obj.registration.stall.block or '—'
    get_block.short_description = 'Block'

    def amount_inr(self, obj):
        return format_html('<strong>₹{}</strong>', f'{obj.amount:,.2f}')
    amount_inr.short_description = 'Amount'

    def status_badge(self, obj):
        colours = {
            'Successful': ('#15803d', '#dcfce7'),
            'Pending'   : ('#92400e', '#fef3c7'),
            'Failed'    : ('#b91c1c', '#fee2e2'),
        }
        colour, bg = colours.get(obj.status, ('#6b7280', '#f9fafb'))
        return format_html(
            '<span style="background:{};color:{};padding:3px 12px;border-radius:99px;'
            'font-size:11px;font-weight:700;">{}</span>',
            bg, colour, obj.status,
        )
    status_badge.short_description = 'Status'


# ── UPI Payment Verification Admin ─────────────────────────────────────────────

@admin.action(description="✅ Verify & confirm selected UPI payments")
def verify_upi_payments(modeladmin, request, queryset):
    """
    Accounts dept action: mark selected UPI submissions as verified.
    Automatically:
      - Sets UpiPaymentSubmission.is_verified = True
      - Sets ExhibitorRegistration.payment_status = 'paid'
      - Sets Stall.status = 'booked'
    """
    confirmed = 0
    skipped   = 0
    for submission in queryset:
        if submission.is_verified:
            skipped += 1
            continue

        try:
            # 1. Mark submission verified
            submission.is_verified = True
            submission.verified_by = request.user
            submission.verified_at = timezone.now()
            submission.save(update_fields=['is_verified', 'verified_by', 'verified_at'])

            # 2. Mark registration paid
            reg = submission.registration
            reg.payment_status = 'paid'
            reg.save(update_fields=['payment_status'])

            # 3. Lock the stall
            stall = reg.stall
            stall.status = 'booked'
            stall.save(update_fields=['status'])

            # 4. Fire confirmation email (best-effort)
            try:
                from exhibitions.email_utils import send_payment_confirmed_email
                send_payment_confirmed_email(reg, receipt_url=None)
            except Exception as exc:
                modeladmin.message_user(
                    request,
                    f"Email failed for {reg.company_name}: {exc}",
                    messages.WARNING,
                )
            confirmed += 1

        except Exception as exc:
            modeladmin.message_user(
                request,
                f"Error processing {submission}: {exc}",
                messages.ERROR,
            )

    if confirmed:
        modeladmin.message_user(
            request,
            f"✅ {confirmed} UPI payment(s) verified. Stalls confirmed and companies notified.",
            messages.SUCCESS,
        )
    if skipped:
        modeladmin.message_user(
            request,
            f"{skipped} submission(s) were already verified — skipped.",
            messages.WARNING,
        )


@admin.register(UpiPaymentSubmission)
class UpiPaymentSubmissionAdmin(admin.ModelAdmin):
    """
    Purpose-built admin view for the Accounts Department.
    Everything needed to verify a UPI payment is visible at a glance:
    company → stall → block → amount → UTR → payer → submitted timestamp.
    One-click verify action confirms the booking end-to-end.
    """
    list_display = (
        'verification_badge',
        'company_name',
        'stall_info',
        'amount_inr',
        'utr_chip',
        'payer_upi_id',
        'transaction_note_short',
        'submitted_at',
        'verified_by',
    )
    list_filter  = ('is_verified', 'submitted_at')
    search_fields = (
        'utr_number',
        'payer_upi_id',
        'registration__company_name',
        'registration__stall__stall_number',
        'transaction_note',
    )
    readonly_fields = (
        'registration_detail_panel',
        'transaction_note',
        'amount',
        'submitted_at',
        'updated_at',
        'verified_by',
        'verified_at',
    )
    actions = [verify_upi_payments]
    ordering = ['-submitted_at']
    date_hierarchy = 'submitted_at'

    fieldsets = (
        ("🏢 Registration", {
            'fields': ('registration_detail_panel',),
        }),
        ("💰 Payment Details", {
            'fields': ('amount', 'utr_number', 'payer_upi_id', 'transaction_note'),
            'description': (
                "<strong>UTR Number</strong> is the key identifier — "
                "cross-check it against the RRU HDFC bank statement before verifying. "
                "The <strong>Transaction Note</strong> is HMAC-signed by the server; "
                "if it does not match the format <code>DAR2026_REG*_STL*_*</code>, treat as suspicious."
            ),
        }),
        ("✅ Verification", {
            'fields': ('is_verified', 'verified_by', 'verified_at', 'admin_notes'),
            'description': (
                "Use the <strong>list-view action</strong> "
                "(✅ Verify & confirm selected UPI payments) to verify payments — "
                "it automatically marks the stall as Booked and sends the confirmation email."
            ),
        }),
        ("Timestamps", {
            'fields': ('submitted_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    # ── Custom display columns ─────────────────────────────────────────────────

    def verification_badge(self, obj):
        if obj.is_verified:
            return format_html(
                '<span style="background:#dcfce7;color:#15803d;padding:3px 10px;'
                'border-radius:99px;font-size:11px;font-weight:700;">✅ Verified</span>'
            )
        return format_html(
            '<span style="background:#fef3c7;color:#92400e;padding:3px 10px;'
            'border-radius:99px;font-size:11px;font-weight:700;">⏳ Pending</span>'
        )
    verification_badge.short_description = 'Status'
    verification_badge.admin_order_field = 'is_verified'

    def company_name(self, obj):
        return format_html(
            '<strong style="color:#0A1628">{}</strong>',
            obj.registration.company_name,
        )
    company_name.short_description = 'Company'
    company_name.admin_order_field = 'registration__company_name'

    def stall_info(self, obj):
        stall = obj.registration.stall
        if stall.block:
            return format_html(
                '<span style="font-weight:700;color:#C24F1D">{}</span>'
                '<br><span style="font-size:11px;color:#6b7280">Block {}</span>',
                stall.stall_number, stall.block,
            )
        return format_html(
            '<span style="font-weight:700;color:#C24F1D">{}</span>',
            stall.stall_number,
        )
    stall_info.short_description = 'Stall'

    def amount_inr(self, obj):
        return format_html(
            '<strong style="font-size:14px;color:#15803d">₹{}</strong>',
            f'{obj.amount:,.0f}',
        )
    amount_inr.short_description = 'Amount (INR)'
    amount_inr.admin_order_field = 'amount'

    def utr_chip(self, obj):
        return format_html(
            '<code style="background:#f1f5f9;padding:3px 8px;border-radius:4px;'
            'font-size:12px;letter-spacing:0.05em;color:#0f172a">{}</code>',
            obj.utr_number,
        )
    utr_chip.short_description = 'UTR / Ref No.'

    def transaction_note_short(self, obj):
        if not obj.transaction_note:
            return '—'
        return format_html(
            '<span style="font-size:11px;color:#6b7280;font-family:monospace">{}</span>',
            obj.transaction_note[:36] + ('…' if len(obj.transaction_note) > 36 else ''),
        )
    transaction_note_short.short_description = 'Txn Note (HMAC)'

    def registration_detail_panel(self, obj):
        reg   = obj.registration
        stall = reg.stall
        return format_html(
            """
            <table style="border-collapse:collapse;width:100%">
              <tr>
                <td style="padding:6px 12px;font-weight:700;color:#6b7280;width:200px">Company</td>
                <td style="padding:6px 12px">{}</td>
              </tr>
              <tr style="background:#f8fafc">
                <td style="padding:6px 12px;font-weight:700;color:#6b7280">Representative</td>
                <td style="padding:6px 12px">{} &lt;{}&gt;</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;font-weight:700;color:#6b7280">Phone</td>
                <td style="padding:6px 12px">{}</td>
              </tr>
              <tr style="background:#f8fafc">
                <td style="padding:6px 12px;font-weight:700;color:#6b7280">Stall</td>
                <td style="padding:6px 12px"><strong>{}</strong>{}, {}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;font-weight:700;color:#6b7280">Stall Price</td>
                <td style="padding:6px 12px"><strong style="color:#15803d">₹{}</strong></td>
              </tr>
              <tr style="background:#f8fafc">
                <td style="padding:6px 12px;font-weight:700;color:#6b7280">Approval</td>
                <td style="padding:6px 12px">{}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px;font-weight:700;color:#6b7280">Payment Status</td>
                <td style="padding:6px 12px">{}</td>
              </tr>
            </table>
            """,
            reg.company_name,
            reg.representative_name, reg.contact_email,
            reg.contact_phone,
            stall.stall_number, f' — Block {stall.block}' if stall.block else '', stall.size,
            f'{stall.price:,.2f}',
            reg.get_approval_status_display(),
            reg.get_payment_status_display(),
        )
    registration_detail_panel.short_description = 'Registration Details'
