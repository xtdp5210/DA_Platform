import client from "./client";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface RegisterPayload {
  representative_name: string;  // backend uses this, not "name"
  company_name: string;
  email: string;
  phone_number: string;         // backend uses this, not "phone"
  password: string;
}

export const register = (data: RegisterPayload) =>
  axios.post(`${BASE_URL}/users/register`, data);

export const login = (data: { email: string; password: string }) =>
  axios.post(`${BASE_URL}/users/login`, data);

// Backend field is otp_code not otp
export const verifyOTP = (data: { email: string; otp_code: string }) =>
  axios.post(`${BASE_URL}/users/verify_otp`, data);

export const resendOTP = (email: string) =>
  axios.post(`${BASE_URL}/users/resend_otp`, { email });

export const forgotPassword = (email: string) =>
  axios.post(`${BASE_URL}/users/forgot_password`, { email });

// Backend field is otp_code not otp
export const resetPassword = (data: {
  email: string;
  otp_code: string;
  new_password: string;
}) => axios.post(`${BASE_URL}/users/reset_password`, data);

export const getProfile = () => client.get("/users/profile");
export const updateProfile = (data: any) => client.patch("/users/profile", data);