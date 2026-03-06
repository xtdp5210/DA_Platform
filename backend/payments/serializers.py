from rest_framework import serializers


class CreateOrderSerializer(serializers.Serializer):
    registration_id = serializers.IntegerField()


class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()


# ── UPI QR ──────────────────────────────────────────────────────────────────────

class GenerateQRSerializer(serializers.Serializer):
    registration_id = serializers.IntegerField()


class SubmitUtrSerializer(serializers.Serializer):
    """
    Payload sent by the user after they have paid via UPI scan.
    The UTR (Unique Transaction Reference) is the 12-digit number shown
    in the payer's banking app on successful transfer.
    """
    registration_id  = serializers.IntegerField()
    utr_number       = serializers.CharField(
        max_length=100,
        help_text="12-22 character UTR / reference number from your banking app.",
    )
    payer_upi_id     = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        help_text="Optional: your UPI ID or bank account used for the transfer.",
    )
    transaction_note = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        help_text="Echo back the transaction_note shown on the QR screen.",
    )

    def validate_utr_number(self, value):
        import re
        value = value.strip().upper()
        if len(value) < 8:
            raise serializers.ValidationError(
                "UTR number must be at least 8 characters. "
                "Check your banking app for the transaction reference."
            )
        # Allow only alphanumeric characters — no spaces, slashes, or injection chars
        if not re.match(r'^[A-Z0-9]+$', value):
            raise serializers.ValidationError(
                "UTR number may only contain letters and digits."
            )
        return value

    def validate(self, data):
        """
        Cross-field validation: if a transaction_note is provided, verify
        that the REG<id> embedded in it matches the submitted registration_id.
        This prevents a user from submitting a note generated for a different
        registration (note-swapping attack).
        """
        import re
        note = data.get('transaction_note', '')
        reg_id = data.get('registration_id')
        if note and reg_id:
            match = re.search(r'_REG(\d+)_', note)
            if match:
                note_reg_id = int(match.group(1))
                if note_reg_id != reg_id:
                    raise serializers.ValidationError(
                        {"transaction_note": "Transaction note does not match the submitted registration."}
                    )
        return data