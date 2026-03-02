import client from "./client";

export const createOrder = (registrationId: number) =>
  client.post("/payments/create_order", { registration_id: registrationId });

export const verifyPayment = (data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  registration_id: number;
}) => client.post("/payments/verify_payment", data);