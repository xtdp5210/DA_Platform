"""
Professional email templates for ExhibitorRegistration lifecycle:
  1. Submission received (sent immediately on registration)
  2. Approval (sent by admin action)
  3. Rejection (sent by admin action)
  4. Payment confirmed (sent by payments app — see payments/views.py)
"""

from django.core.mail import EmailMultiAlternatives
from django.conf import settings


# ── Shared brand header / footer HTML ──────────────────────────────────────────
_HEADER = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
             style="background:#ffffff;border-radius:10px;overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- BRAND HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#0A1628 60%,#1a2e4a);
                     padding:28px 36px 24px;border-bottom:4px solid #C9933A;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td>
                  <div style="color:#C9933A;font-size:10px;font-weight:700;
                               letter-spacing:3px;text-transform:uppercase;
                               margin-bottom:6px;">
                    RASHTRIYA RAKSHA UNIVERSITY
                  </div>
                  <div style="color:#ffffff;font-size:20px;font-weight:800;
                               letter-spacing:0.5px;line-height:1.3;">
                    Defence Attaché Roundtable 2026
                  </div>
                  <div style="color:#8fadd4;font-size:12px;margin-top:4px;
                               font-style:italic;">
                    Official Exhibitor Communication
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""

_FOOTER = """
        <!-- FOOTER -->
        <tr>
          <td style="background:#f8f8f8;padding:24px 36px;
                     border-top:1px solid #e8e8e8;">
            <p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.6;">
              This is an official communication from the Rashtriya Raksha University — 
              Defence Attaché Roundtable 2026 organising team.  
              Please do not reply to this email. For queries, contact us at
              <a href="mailto:da@rru.ac.in" style="color:#C24F1D;text-decoration:none;">da@rru.ac.in</a>.
            </p>
            <p style="margin:0;font-size:11px;color:#aaa;">
              &copy; 2026 Rashtriya Raksha University, Lavad, Gujarat — All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
"""


def _send(subject: str, to_emails: list[str], html_body: str, plain_body: str) -> None:
    """Send an HTML email with a plain-text fallback. Fails silently."""
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_body,
            from_email=f"Defence Attaché Roundtable 2026 <{settings.DEFAULT_FROM_EMAIL}>",
            to=to_emails,
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=True)
    except Exception as exc:
        import logging
        logging.getLogger(__name__).error("Email send failed: %s", exc)


# ── 1. Submission Received ──────────────────────────────────────────────────────
def send_submission_received_email(registration) -> None:
    """Sent immediately after a company submits their exhibitor registration."""
    rep   = registration.representative_name
    co    = registration.company_name
    stall = registration.stall.stall_number
    block = registration.stall.block
    to    = list({registration.contact_email, registration.user.email})

    subject = "Registration Received — Defence Attaché Roundtable 2026"

    html = _HEADER + f"""
        <!-- STATUS BADGE -->
        <tr>
          <td style="background:#FFF8E7;padding:18px 36px 0;text-align:center;">
            <span style="display:inline-block;background:#C9933A;color:#fff;
                         font-size:11px;font-weight:700;letter-spacing:2px;
                         text-transform:uppercase;padding:6px 18px;
                         border-radius:20px;">
              ✔ Registration Submitted
            </span>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 36px 28px;">
            <p style="margin:0 0 18px;font-size:16px;color:#0A1628;font-weight:700;">
              Dear {rep},
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.7;">
              Thank you for registering <strong>{co}</strong> for the 
              <strong>Defence Attaché Roundtable 2026</strong>. We have successfully 
              received your application and it is currently 
              <strong>under review by our organising team</strong>.
            </p>

            <!-- SUMMARY CARD -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                   style="background:#f9f9ff;border:1px solid #dde4f0;border-radius:8px;
                          margin:20px 0;">
              <tr>
                <td style="padding:20px 24px;">
                  <div style="font-size:11px;color:#888;font-weight:700;letter-spacing:2px;
                               text-transform:uppercase;margin-bottom:14px;">
                    Submission Summary
                  </div>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;width:45%;">Company</td>
                      <td style="font-size:13px;color:#0A1628;font-weight:600;padding:5px 0;">{co}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;">Representative</td>
                      <td style="font-size:13px;color:#0A1628;font-weight:600;padding:5px 0;">{rep}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;">Stall Selected</td>
                      <td style="font-size:13px;color:#0A1628;font-weight:600;padding:5px 0;">
                        Stall {stall} — Block {block}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;">Status</td>
                      <td style="font-size:13px;color:#b45309;font-weight:700;padding:5px 0;">
                        ⏳ Under Verification
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- WHAT'S NEXT -->
            <div style="background:#EFF6FF;border-left:4px solid #2563EB;
                        border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;">
              <div style="font-size:12px;font-weight:700;color:#1D4ED8;
                           text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                What Happens Next?
              </div>
              <ol style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:1.9;">
                <li>Our team will review your application details.</li>
                <li>You will receive an <strong>approval or rejection notification</strong> via email.</li>
                <li>Once approved, you can log in to your portal and complete the stall payment.</li>
                <li>After payment, your stall booking will be confirmed and a receipt will be emailed.</li>
              </ol>
            </div>

            <p style="margin:24px 0 0;font-size:13px;color:#666;line-height:1.7;">
              Should you have any questions in the meantime, please do not hesitate to 
              reach out to our team at 
              <a href="mailto:da@rru.ac.in" style="color:#C24F1D;font-weight:600;text-decoration:none;">da@rru.ac.in</a>.
            </p>

            <p style="margin:24px 0 0;font-size:14px;color:#0A1628;font-weight:700;">
              Warm regards,<br />
              <span style="font-weight:400;color:#555;font-size:13px;">
                Organising Secretariat<br />
                Defence Attaché Roundtable 2026<br />
                Rashtriya Raksha University
              </span>
            </p>
          </td>
        </tr>
    """ + _FOOTER

    plain = (
        f"Dear {rep},\n\n"
        f"Thank you for registering {co} for the Defence Attaché Roundtable 2026.\n\n"
        f"Your application for Stall {stall} (Block {block}) has been received and is currently under verification by our team.\n\n"
        "What happens next:\n"
        "1. Our team will review your application.\n"
        "2. You will receive an approval or rejection email.\n"
        "3. Once approved, you can log in and complete the stall payment.\n\n"
        "For queries, contact: da@rru.ac.in\n\n"
        "Regards,\nOrganising Secretariat\nDefence Attaché Roundtable 2026\nRashtriya Raksha University"
    )

    _send(subject, to, html, plain)


# ── 2. Approved ────────────────────────────────────────────────────────────────
def send_approval_email(registration) -> None:
    """Sent when admin approves the registration."""
    rep   = registration.representative_name
    co    = registration.company_name
    stall = registration.stall.stall_number
    block = registration.stall.block
    price = registration.stall.price
    to    = list({registration.contact_email, registration.user.email})

    subject = "Application Approved — Proceed to Payment | Defence Attaché Roundtable 2026"

    html = _HEADER + f"""
        <!-- STATUS BADGE -->
        <tr>
          <td style="background:#F0FDF4;padding:18px 36px 0;text-align:center;">
            <span style="display:inline-block;background:#16a34a;color:#fff;
                         font-size:11px;font-weight:700;letter-spacing:2px;
                         text-transform:uppercase;padding:6px 18px;
                         border-radius:20px;">
              ✅ Application Approved
            </span>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 36px 28px;">
            <p style="margin:0 0 18px;font-size:16px;color:#0A1628;font-weight:700;">
              Dear {rep},
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.7;">
              We are pleased to inform you that the application of <strong>{co}</strong> 
              for the <strong>Defence Attaché Roundtable 2026</strong> has been 
              <strong style="color:#16a34a;">officially approved</strong> by our organising team.
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.7;">
              You may now proceed to complete your stall booking by making the payment through 
              your Exhibitor Portal.
            </p>

            <!-- SUMMARY CARD -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                   style="background:#F0FDF4;border:1px solid #bbf7d0;border-radius:8px;
                          margin:20px 0;">
              <tr>
                <td style="padding:20px 24px;">
                  <div style="font-size:11px;color:#15803d;font-weight:700;letter-spacing:2px;
                               text-transform:uppercase;margin-bottom:14px;">
                    Booking Details
                  </div>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;width:45%;">Company</td>
                      <td style="font-size:13px;color:#0A1628;font-weight:600;padding:5px 0;">{co}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;">Stall Allocated</td>
                      <td style="font-size:13px;color:#0A1628;font-weight:600;padding:5px 0;">
                        Stall {stall} — Block {block}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;">Amount Payable</td>
                      <td style="font-size:13px;color:#0A1628;font-weight:700;padding:5px 0;">
                        ₹{price:,}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;">Status</td>
                      <td style="font-size:13px;color:#16a34a;font-weight:700;padding:5px 0;">
                        ✅ Approved — Payment Pending
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
              <tr>
                <td style="border-radius:8px;background:#C24F1D;">
                  <a href="https://da.rru.ac.in/dashboard"
                     style="display:inline-block;padding:14px 32px;font-size:14px;
                            font-weight:700;color:#ffffff;text-decoration:none;
                            letter-spacing:0.5px;">
                    Go to Exhibitor Portal →
                  </a>
                </td>
              </tr>
            </table>

            <div style="background:#FFF7ED;border-left:4px solid #F59E0B;
                        border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
              <p style="margin:0;font-size:13px;color:#92400E;line-height:1.6;">
                <strong>Important:</strong> Please complete the payment at the earliest to 
                secure your stall allocation. Approved stalls that remain unpaid may be 
                reassigned after the payment deadline.
              </p>
            </div>

            <p style="margin:20px 0 0;font-size:14px;color:#0A1628;font-weight:700;">
              Warm regards,<br />
              <span style="font-weight:400;color:#555;font-size:13px;">
                Organising Secretariat<br />
                Defence Attaché Roundtable 2026<br />
                Rashtriya Raksha University
              </span>
            </p>
          </td>
        </tr>
    """ + _FOOTER

    plain = (
        f"Dear {rep},\n\n"
        f"We are pleased to inform you that the application of {co} has been APPROVED.\n\n"
        f"Stall: {stall} — Block {block}\nAmount Payable: Rs. {price}\n\n"
        "Please log in to your Exhibitor Portal to complete the payment:\n"
        "https://da.rru.ac.in/dashboard\n\n"
        "Important: Please complete payment promptly to secure your stall.\n\n"
        "Regards,\nOrganising Secretariat\nDefence Attaché Roundtable 2026\nRashtriya Raksha University"
    )

    _send(subject, to, html, plain)


# ── 3. Rejected ────────────────────────────────────────────────────────────────
def send_rejection_email(registration, reason: str = "") -> None:
    """Sent when admin rejects the registration."""
    rep = registration.representative_name
    co  = registration.company_name
    to  = list({registration.contact_email, registration.user.email})

    subject = "Application Update — Defence Attaché Roundtable 2026"

    reason_html = (
        f"""
        <div style="background:#FEF2F2;border-left:4px solid #DC2626;
                    border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
          <div style="font-size:11px;font-weight:700;color:#991B1B;
                       text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
            Reason Provided
          </div>
          <p style="margin:0;font-size:13px;color:#7F1D1D;line-height:1.6;">
            {reason}
          </p>
        </div>
        """
        if reason.strip()
        else ""
    )

    reason_plain = f"\nReason: {reason}\n" if reason.strip() else ""

    html = _HEADER + f"""
        <!-- STATUS BADGE -->
        <tr>
          <td style="background:#FEF2F2;padding:18px 36px 0;text-align:center;">
            <span style="display:inline-block;background:#DC2626;color:#fff;
                         font-size:11px;font-weight:700;letter-spacing:2px;
                         text-transform:uppercase;padding:6px 18px;
                         border-radius:20px;">
              ✗ Application Not Approved
            </span>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 36px 28px;">
            <p style="margin:0 0 18px;font-size:16px;color:#0A1628;font-weight:700;">
              Dear {rep},
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.7;">
              Thank you for your interest in the <strong>Defence Attaché Roundtable 2026</strong> 
              and for taking the time to submit your application on behalf of <strong>{co}</strong>.
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.7;">
              After careful review by our organising committee, we regret to inform you that 
              your application has <strong style="color:#DC2626;">not been approved</strong> 
              at this time.
            </p>

            {reason_html}

            <div style="background:#EFF6FF;border-left:4px solid #2563EB;
                        border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
              <p style="margin:0;font-size:13px;color:#1e3a5f;line-height:1.6;">
                If you believe this decision was made in error, or if you would like to 
                provide additional information to support your application, please contact 
                our team at 
                <a href="mailto:da@rru.ac.in" style="color:#C24F1D;font-weight:600;text-decoration:none;">da@rru.ac.in</a>
                within <strong>5 business days</strong>.
              </p>
            </div>

            <p style="margin:20px 0 0;font-size:13px;color:#666;line-height:1.7;">
              We appreciate your interest and encourage you to explore future editions of the 
              Defence Attaché Roundtable. We wish your organisation continued success.
            </p>

            <p style="margin:24px 0 0;font-size:14px;color:#0A1628;font-weight:700;">
              Yours sincerely,<br />
              <span style="font-weight:400;color:#555;font-size:13px;">
                Organising Secretariat<br />
                Defence Attaché Roundtable 2026<br />
                Rashtriya Raksha University
              </span>
            </p>
          </td>
        </tr>
    """ + _FOOTER

    plain = (
        f"Dear {rep},\n\n"
        f"After careful review, we regret to inform you that the application of {co} "
        f"for the Defence Attaché Roundtable 2026 has not been approved.\n"
        f"{reason_plain}\n"
        "If you believe this is an error or wish to provide more information, please contact "
        "da@rru.ac.in within 5 business days.\n\n"
        "Regards,\nOrganising Secretariat\nDefence Attaché Roundtable 2026\nRashtriya Raksha University"
    )

    _send(subject, to, html, plain)


# ── 4. Payment Confirmed ────────────────────────────────────────────────────────
def send_payment_confirmed_email(registration, receipt_url: str = "") -> None:
    """Sent after successful payment. Receipt PDF is attached separately in payments/views.py."""
    rep   = registration.representative_name
    co    = registration.company_name
    stall = registration.stall.stall_number
    block = registration.stall.block
    price = registration.stall.price
    to    = list({registration.contact_email, registration.user.email})

    subject = "🎉 Stall Booking Confirmed — Defence Attaché Roundtable 2026"

    html = _HEADER + f"""
        <!-- STATUS BADGE -->
        <tr>
          <td style="background:#F0FDF4;padding:18px 36px 0;text-align:center;">
            <span style="display:inline-block;background:#16a34a;color:#fff;
                         font-size:11px;font-weight:700;letter-spacing:2px;
                         text-transform:uppercase;padding:6px 18px;
                         border-radius:20px;">
              🎉 Booking Confirmed
            </span>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 36px 28px;">
            <p style="margin:0 0 18px;font-size:16px;color:#0A1628;font-weight:700;">
              Dear {rep},
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.7;">
              Congratulations! Your payment has been successfully processed and your stall 
              at the <strong>Defence Attaché Roundtable 2026</strong> is now 
              <strong style="color:#16a34a;">officially confirmed</strong>.
            </p>

            <!-- CONFIRMATION CARD -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                   style="background:#F0FDF4;border:1px solid #bbf7d0;border-radius:8px;
                          margin:20px 0;">
              <tr>
                <td style="padding:20px 24px;">
                  <div style="font-size:11px;color:#15803d;font-weight:700;letter-spacing:2px;
                               text-transform:uppercase;margin-bottom:14px;">
                    Booking Confirmation
                  </div>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;width:45%;">Company</td>
                      <td style="font-size:13px;color:#0A1628;font-weight:600;padding:5px 0;">{co}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;">Stall</td>
                      <td style="font-size:13px;color:#0A1628;font-weight:600;padding:5px 0;">
                        Stall {stall} — Block {block}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;">Amount Paid</td>
                      <td style="font-size:13px;color:#0A1628;font-weight:700;padding:5px 0;">
                        ₹{price:,}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#555;padding:5px 0;">Status</td>
                      <td style="font-size:13px;color:#16a34a;font-weight:700;padding:5px 0;">
                        ✅ Confirmed & Booked
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:16px 0;font-size:14px;color:#444;line-height:1.7;">
              Your official payment receipt is attached to this email for your records. 
              Please retain this document for reference at the venue.
            </p>

            <div style="background:#FFF7ED;border-left:4px solid #F59E0B;
                        border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;">
              <p style="margin:0;font-size:13px;color:#92400E;line-height:1.6;">
                <strong>Event Details:</strong> Defence Attaché Roundtable 2026<br />
                Rashtriya Raksha University, Lavad Campus, Gujarat, India.<br />
                Further logistical details and exhibitor guidelines will be communicated 
                closer to the event date.
              </p>
            </div>

            <p style="margin:20px 0 0;font-size:14px;color:#0A1628;font-weight:700;">
              Warm regards,<br />
              <span style="font-weight:400;color:#555;font-size:13px;">
                Organising Secretariat<br />
                Defence Attaché Roundtable 2026<br />
                Rashtriya Raksha University
              </span>
            </p>
          </td>
        </tr>
    """ + _FOOTER

    plain = (
        f"Dear {rep},\n\n"
        f"Congratulations! Your payment for Stall {stall} (Block {block}) has been successfully processed "
        f"and your booking at the Defence Attaché Roundtable 2026 is CONFIRMED.\n\n"
        f"Company: {co}\nAmount Paid: Rs. {price}\n\n"
        "Please find your payment receipt attached.\n\n"
        "Further details about the event will be communicated separately.\n\n"
        "Regards,\nOrganising Secretariat\nDefence Attaché Roundtable 2026\nRashtriya Raksha University"
    )

    _send(subject, to, html, plain)
