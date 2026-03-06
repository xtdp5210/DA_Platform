from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
import razorpay
import json
from exhibitions.models import ExhibitorRegistration, Stall
from exhibitions.email_utils import send_payment_confirmed_email
from .models import Payment, UpiPaymentSubmission
from .serializers import (
    CreateOrderSerializer, VerifyPaymentSerializer,
    GenerateQRSerializer, SubmitUtrSerializer,
)
from .utils import generate_receipt_pdf, generate_upi_qr

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateOrderView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            registration_id = serializer.validated_data['registration_id']
            
            try:
                registration = ExhibitorRegistration.objects.get(id=registration_id, user=request.user)
            except ExhibitorRegistration.DoesNotExist:
                return Response({"error": "Registration not found."}, status=status.HTTP_404_NOT_FOUND)

            if registration.payment_status == 'paid':
                return Response({"error": "This registration is already paid."}, status=status.HTTP_400_BAD_REQUEST)

            if registration.approval_status != 'approved':
                return Response(
                    {"error": "Your registration is currently under review. Payment will be enabled once the organising team approves your application."},
                    status=status.HTTP_403_FORBIDDEN
                )

            amount_in_inr = registration.stall.price
            amount_in_paise = int(amount_in_inr * 100)

            razorpay_order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": f"receipt_reg_{registration.id}",
                "payment_capture": 1
            })

            payment, created = Payment.objects.get_or_create(
                registration=registration,
                defaults={
                    'amount': amount_in_inr,
                    'razorpay_order_id': razorpay_order['id'],
                    'status': 'Pending'
                }
            )
            
            
            if not created:
                payment.razorpay_order_id = razorpay_order['id']
                payment.save()

            return Response({
                "message": "Order Created",
                "razorpay_order_id": razorpay_order['id'],
                "amount": amount_in_inr,
                "key_id": settings.RAZORPAY_KEY_ID
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyPaymentView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        if serializer.is_valid():
            razorpay_order_id = serializer.validated_data['razorpay_order_id']
            razorpay_payment_id = serializer.validated_data['razorpay_payment_id']
            razorpay_signature = serializer.validated_data['razorpay_signature']

            try:
                payment = Payment.objects.get(
                    razorpay_order_id=razorpay_order_id,
                    registration__user=request.user,  # Broken Access Control fix: enforce ownership
                )
            except Payment.DoesNotExist:
                return Response({"error": "Invalid Order ID"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                client.utility.verify_payment_signature({
                    'razorpay_order_id': razorpay_order_id,
                    'razorpay_payment_id': razorpay_payment_id,
                    'razorpay_signature': razorpay_signature
                })
            except razorpay.errors.SignatureVerificationError:
                payment.status = 'Failed'
                payment.save()
                
                stall = payment.registration.stall
                stall.status = 'available'
                stall.save()
                
                return Response({"error": "Payment verification failed. Stall unlocked."}, status=status.HTTP_400_BAD_REQUEST)

            payment.status = 'Successful'
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.save()

            registration = payment.registration
            registration.payment_status = 'paid'
            registration.save()

            stall = registration.stall
            stall.status = 'booked'
            stall.save()

            # Generate PDF in memory and email it as attachment.
            # Render free tier has ephemeral disk — receipt delivered via email only.
            pdf_file = generate_receipt_pdf(payment)

            try:
                from django.core.mail import EmailMultiAlternatives
                send_payment_confirmed_email(registration, receipt_url=None)
                if pdf_file:
                    to_emails = list({registration.contact_email, request.user.email})
                    attach_msg = EmailMultiAlternatives(
                        subject="📎 Your Official Receipt — Defence Attaché Roundtable 2026",
                        body=(
                            f"Dear {registration.representative_name},\n\n"
                            "Please find your official stall booking receipt attached.\n\n"
                            "Regards,\nOrganising Secretariat\nDefence Attaché Roundtable 2026"
                        ),
                        from_email=f"Defence Attaché Roundtable 2026 <{settings.DEFAULT_FROM_EMAIL}>",
                        to=to_emails,
                    )
                    attach_msg.attach(pdf_file.name, pdf_file.read(), "application/pdf")
                    attach_msg.send(fail_silently=True)
            except Exception as e:
                import logging
                logging.getLogger(__name__).error("Payment receipt email failed: %s", e)

            return Response({
                "message": "Payment successful! Stall officially booked. Receipt has been emailed.",
                "receipt_url": None,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RazorpayWebhookView(views.APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        webhook_signature = request.headers.get('X-Razorpay-Signature')
        payload = request.body.decode('utf-8')

        try:
            client.utility.verify_webhook_signature(
                payload, 
                webhook_signature, 
                settings.RAZORPAY_WEBHOOK_SECRET
            )
        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Invalid Signature'}, status=status.HTTP_400_BAD_REQUEST)

        data = json.loads(payload)
        
        if data['event'] == 'payment.captured':
            payment_entity = data['payload']['payment']['entity']
            order_id = payment_entity['order_id']
            payment_id = payment_entity['id']

            try:
                payment = Payment.objects.get(razorpay_order_id=order_id)
                
                if payment.status == 'Pending':
                    payment.status = 'Successful'
                    payment.razorpay_payment_id = payment_id
                    payment.save()

                    registration = payment.registration
                    registration.payment_status = 'paid'
                    registration.save()

                    stall = registration.stall
                    stall.status = 'booked'
                    stall.save()

                    pdf_file = generate_receipt_pdf(payment)
                    if pdf_file:
                        # Email-only — no disk write (ephemeral filesystem on Render free)
                        try:
                            from django.core.mail import EmailMultiAlternatives
                            to_emails = list({registration.contact_email})
                            attach_msg = EmailMultiAlternatives(
                                subject="📎 Your Official Receipt — Defence Attaché Roundtable 2026",
                                body=(
                                    f"Dear {registration.representative_name},\n\n"
                                    "Your payment has been confirmed. Receipt is attached.\n\n"
                                    "Regards,\nOrganising Secretariat\nDefence Attaché Roundtable 2026"
                                ),
                                from_email=f"Defence Attaché Roundtable 2026 <{settings.DEFAULT_FROM_EMAIL}>",
                                to=to_emails,
                            )
                            attach_msg.attach(pdf_file.name, pdf_file.read(), "application/pdf")
                            attach_msg.send(fail_silently=True)
                        except Exception as e:
                            import logging
                            logging.getLogger(__name__).error("Webhook receipt email failed: %s", e)

            except Payment.DoesNotExist:
                pass 

        return Response(status=status.HTTP_200_OK)


# ── UPI QR Code Views ────────────────────────────────────────────────────────────

class GenerateUpiQRView(views.APIView):
    """
    GET /payments/generate_upi_qr?registration_id=<id>

    Returns a fresh, time-limited, HMAC-signed UPI QR code image (base64).
    Amount is read server-side from the stall price — the client cannot
    supply or modify it.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = GenerateQRSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        registration_id = serializer.validated_data['registration_id']

        try:
            registration = ExhibitorRegistration.objects.select_related(
                'stall', 'user'
            ).get(id=registration_id, user=request.user)
        except ExhibitorRegistration.DoesNotExist:
            return Response(
                {"error": "Registration not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if registration.approval_status != 'approved':
            return Response(
                {"error": "Only approved registrations can generate a payment QR."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if registration.payment_status == 'paid':
            return Response(
                {"error": "This registration is already paid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qr_data = generate_upi_qr(registration)
        return Response(qr_data, status=status.HTTP_200_OK)


class SubmitUpiPaymentView(views.APIView):
    """
    POST /payments/submit_upi_payment

    Called after the user has scanned the QR and completed the UPI transfer.
    Stores the UTR number and marks the registration as 'processing'.
    The accounts department then verifies the UTR in the bank statement
    and uses the admin action to confirm the payment.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubmitUtrSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        registration_id  = serializer.validated_data['registration_id']
        utr_number       = serializer.validated_data['utr_number']  # already normalised to uppercase in serializer
        payer_upi_id     = serializer.validated_data.get('payer_upi_id', '')
        transaction_note = serializer.validated_data.get('transaction_note', '')

        try:
            registration = ExhibitorRegistration.objects.select_related(
                'stall'
            ).get(id=registration_id, user=request.user)
        except ExhibitorRegistration.DoesNotExist:
            return Response(
                {"error": "Registration not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if registration.approval_status != 'approved':
            return Response(
                {"error": "Only approved registrations may submit a payment."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if registration.payment_status == 'paid':
            return Response(
                {"error": "This registration is already paid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if registration.payment_status == 'processing':
            return Response(
                {"error": "A payment submission already exists for this registration. "
                          "Please contact support if you need to update your UTR."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── UTR Uniqueness Guard ───────────────────────────────────────────────
        # A UTR (bank transaction reference) is globally unique — each bank
        # transfer has exactly one UTR.  If the same UTR appears twice, either:
        #   a) the user is trying to use one payment to unlock two stalls, or
        #   b) it is a data-entry error.
        # We reject in either case; the accounts dept can override via admin.
        utr_number = serializer.validated_data['utr_number']
        if UpiPaymentSubmission.objects.filter(utr_number=utr_number).exists():
            import logging
            logging.getLogger(__name__).warning(
                "Duplicate UTR submission attempt: UTR=%s REG=%s USER=%s",
                utr_number, registration_id, request.user.id,
            )
            return Response(
                {"error": "This UTR number has already been submitted. "
                          "If you believe this is an error, contact da@rru.ac.in."},
                status=status.HTTP_409_CONFLICT,
            )

        # Persist the UPI payment record.
        # Amount is locked to the stall price — never taken from the request body.
        UpiPaymentSubmission.objects.create(
            registration     = registration,
            amount           = registration.stall.price,
            utr_number       = utr_number,
            payer_upi_id     = payer_upi_id,
            transaction_note = transaction_note,
        )

        # Mark as 'processing' so the accounts dept can see it in admin
        registration.payment_status = 'processing'
        registration.save(update_fields=['payment_status'])

        import logging
        logging.getLogger(__name__).info(
            "UPI payment submitted: REG=%s COMPANY=%s UTR=%s AMOUNT=%s",
            registration.id,
            registration.company_name,
            utr_number,
            registration.stall.price,
        )

        return Response(
            {
                "message": (
                    "Payment reference submitted successfully. "
                    "Our accounts department will verify your transfer within 1 business day "
                    "and you will receive a confirmation email."
                ),
                "utr_number"   : utr_number,
                "amount"       : str(registration.stall.price),
            },
            status=status.HTTP_201_CREATED,
        )