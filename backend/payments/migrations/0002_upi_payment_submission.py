import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
        ('exhibitions', '0002_add_approval_status_and_rejection_reason'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UpiPaymentSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(
                    decimal_places=2,
                    max_digits=10,
                    help_text='Amount in INR — auto-filled from stall price, cannot be manipulated by user.',
                )),
                ('utr_number', models.CharField(
                    max_length=100,
                    help_text='UTR / Transaction Reference Number provided by the payer after transfer.',
                )),
                ('payer_upi_id', models.CharField(
                    max_length=255,
                    blank=True,
                    help_text="Optional: payer's UPI ID or bank account (for cross-check).",
                )),
                ('transaction_note', models.CharField(
                    max_length=255,
                    blank=True,
                    help_text='Transaction note embedded in the QR (contains HMAC token — do NOT edit).',
                )),
                ('is_verified', models.BooleanField(
                    default=False,
                    help_text='Set True via admin action after verifying UTR in bank statement.',
                )),
                ('verified_at', models.DateTimeField(null=True, blank=True)),
                ('admin_notes', models.TextField(
                    blank=True,
                    help_text='Internal notes for the accounts department (e.g. discrepancy, duplicate).',
                )),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('registration', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='upi_payment',
                    to='exhibitions.exhibitorregistration',
                )),
                ('verified_by', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='upi_verifications',
                    to=settings.AUTH_USER_MODEL,
                    help_text='Staff member who verified the payment.',
                )),
            ],
            options={
                'verbose_name': 'UPI Payment Submission',
                'verbose_name_plural': 'UPI Payment Submissions',
                'ordering': ['-submitted_at'],
            },
        ),
    ]
