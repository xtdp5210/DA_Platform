import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "../../../api/auth";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email: string = location.state?.email || "";

  const [form, setForm] = useState({ otp_code: "", new_password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.new_password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      // Backend expects: { email, otp_code, new_password }
      await resetPassword({ email, otp_code: form.otp_code, new_password: form.new_password });
      navigate("/login", { state: { message: "Password reset successful. Please sign in." } });
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Reset failed. Check your OTP and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Enter the OTP sent to <span className="font-medium">{email || "your email"}</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
              <input type="text" value={form.otp_code}
                onChange={(e) => { setForm({ ...form, otp_code: e.target.value }); setError(""); }}
                required maxLength={6} placeholder="6-digit code"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" value={form.new_password}
                onChange={(e) => { setForm({ ...form, new_password: e.target.value }); setError(""); }}
                required placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={form.confirm}
                onChange={(e) => { setForm({ ...form, confirm: e.target.value }); setError(""); }}
                required placeholder="Repeat new password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-blue-600 font-medium hover:underline">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;