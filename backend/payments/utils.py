import io
import hmac
import hashlib
import time
import base64
import logging
from io import BytesIO
from urllib.parse import quote as urlquote
from django.template.loader import get_template
from django.conf import settings
from xhtml2pdf import pisa
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)

# QR validity window — 10 minutes.  After this the timer on the frontend
# expires and the user must click "Pay Now" again to get a fresh QR.
QR_VALIDITY_SECONDS = 600


def _bank_details() -> tuple[str, str, str, str]:
    """
    Read UPI / bank destination from Django settings (backed by env vars).
    Returns (vpa, account_no, ifsc, account_name).

    UPI_VPA is the registered Virtual Payment Address (e.g. rru.da@hdfcbank).
    If UPI_VPA is not set the system warns loudly and falls back to the
    accountno@ifsc.ifsc.npci format — this fallback will be REFUNDED by
    Google Pay / PhonePe unless HDFC has explicitly enabled UPI on the account.
    """
    vpa = getattr(settings, 'UPI_VPA', '').strip()
    if not vpa:
        # Build fallback VPA from account number + IFSC (NPCI technical format).
        # WARNING: payments WILL be refunded unless HDFC enables UPI collections.
        vpa = f"{settings.UPI_ACCOUNT_NO}@{settings.UPI_IFSC}.ifsc.npci"
        logger.warning(
            "UPI_VPA is not configured.  Falling back to account-number VPA (%s). "
            "Google Pay / PhonePe will REFUND payments unless HDFC enables UPI "
            "collection on this account.  Set UPI_VPA in your env vars.",
            vpa,
        )
    return (
        vpa,
        settings.UPI_ACCOUNT_NO,
        settings.UPI_IFSC,
        settings.UPI_ACCOUNT_NAME,
    )

def generate_receipt_pdf(payment_obj):
    template_path = 'payments/receipt_template.html'
    context = {'payment': payment_obj}
    
    template = get_template(template_path)
    html = template.render(context)
    
    result = io.BytesIO()
    
    pdf = pisa.pisaDocument(io.BytesIO(html.encode("UTF-8")), result)
    
    if not pdf.err:
        file_name = f"Receipt_{payment_obj.razorpay_order_id}.pdf"
        return ContentFile(result.getvalue(), name=file_name)
    
    return None


# ── UPI QR Code Generation ──────────────────────────────────────────────────────

def _hmac_token(registration_id: int, amount: str, timestamp: int) -> str:
    """
    HMAC-SHA256 compact token.
    Uses Django SECRET_KEY so only the server can produce / verify it.
    Embedded in the UPI transaction note so the accounts dept can cross-check
    that the QR was genuinely issued by this system and has not been tampered.

    Security note: hmac.new() is used (not hmac.digest()) so the key is
    never passed through a hash before use — this is the correct HMAC pattern.
    """
    message = f"{registration_id}:{amount}:{timestamp}"
    mac = hmac.new(
        key    = settings.SECRET_KEY.encode('utf-8'),
        msg    = message.encode('utf-8'),
        digestmod = hashlib.sha256,
    )
    return mac.hexdigest()[:16]   # 16 hex chars = 64 bits — compact but sufficient


def generate_upi_qr(registration) -> dict:
    """
    Generate a tamper-proof, time-limited UPI QR code for a stall registration.

    Security properties:
    - Amount is NOT taken from the client — it is read from the DB stall price.
    - The HMAC token in the transaction note proves this QR was server-issued.
    - The QR expires (frontend enforced) after QR_VALIDITY_SECONDS seconds.

    Returns a dict with qr_code (base64 data-URI), amount, expiry, and metadata.
    """
    import qrcode   # imported here so it is only required when the feature is used

    vpa, account_no, ifsc, account_name = _bank_details()

    amount    = str(registration.stall.price)
    reg_id    = registration.id
    timestamp = int(time.time())
    token     = _hmac_token(reg_id, amount, timestamp)

    # Human-readable + machine-parseable transaction note format:
    # DAR2026_REG<id>_STL<stall>_<hmac16>
    # - Accounts dept filters bank statements by REG or STL prefix
    # - HMAC proves this note was server-issued; forged notes won't match the pattern
    txn_note = f"DAR2026_REG{reg_id}_STL{registration.stall.stall_number}_{token}"

    # URL-encode payee name and transaction note so spaces / special chars
    # don't break the QR deep-link on any UPI app.
    upi_url = (
        f"upi://pay"
        f"?pa={urlquote(vpa, safe='@.')}"
        f"&pn={urlquote(account_name)}"
        f"&am={amount}"
        f"&cu=INR"
        f"&tn={urlquote(txn_note, safe='_')}"
    )

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # Highest — survives up to 30% damage
        box_size=10,
        border=4,
    )
    qr.add_data(upi_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0A1628", back_color="white")

    buffer = BytesIO()
    img.save(buffer, format="PNG")
    qr_b64 = base64.b64encode(buffer.getvalue()).decode()

    return {
        "qr_code"         : f"data:image/png;base64,{qr_b64}",
        "amount"          : amount,
        "stall_number"    : registration.stall.stall_number,
        "block"           : registration.stall.block,
        "company_name"    : registration.company_name,
        "transaction_note": txn_note,
        "expires_at"      : timestamp + QR_VALIDITY_SECONDS,
        "valid_for_seconds": QR_VALIDITY_SECONDS,
        # Bank details displayed in the UI as fallback (for manual NEFT)
        "upi_vpa"         : vpa,
        "bank_account_no" : account_no,
        "bank_ifsc"       : ifsc,
        "bank_name"       : account_name,
    }