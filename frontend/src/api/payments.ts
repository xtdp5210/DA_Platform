import client from "./client";

export const createOrder = (registrationId: number) =>
  client.post("/payments/create_order", { registration_id: registrationId });

export const verifyPayment = (data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  registration_id: number;
}) => client.post("/payments/verify_payment", data);

// ── UPI QR ──────────────────────────────────────────────────────────────────────

export interface UpiQRResponse {
  qr_code: string;           // data:image/png;base64,...
  amount: string;            // "25000.00"
  stall_number: string;
  block: string;
  company_name: string;
  transaction_note: string;  // embed in UTR submit for admin traceability
  expires_at: number;        // Unix timestamp
  valid_for_seconds: number;
  bank_account_no: string;
  bank_ifsc: string;
  bank_name: string;
}

/** Fetch a fresh, HMAC-signed UPI QR code for a registration. */
export const generateUpiQR = (registrationId: number) =>
  client.get<UpiQRResponse>(`/payments/generate_upi_qr?registration_id=${registrationId}`);

export interface SubmitUtrPayload {
  registration_id: number;
  utr_number: string;
  payer_upi_id?: string;
  transaction_note?: string;
}

/** Submit the UTR reference number after completing the UPI transfer. */
export const submitUpiPayment = (data: SubmitUtrPayload) =>
  client.post("/payments/submit_upi_payment", data);
