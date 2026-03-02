import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../../api/auth";

// ── Disposable / temp-mail domain blocklist ──────────────────────────────────
const BLOCKED_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.info", "guerrillamail.biz",
  "guerrillamail.de", "guerrillamail.net", "guerrillamail.org", "guerrillamailblock.com",
  "grr.la", "sharklasers.com", "spam4.me", "tempmail.com", "temp-mail.org",
  "10minutemail.com", "10minutemail.net", "throwaway.email", "throwam.com",
  "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf", "nospam.ze.tc",
  "trashmail.com", "trashmail.at", "trashmail.io", "trashmail.me", "trashmail.net",
  "trashmail.xyz", "trashmail.org", "dispostable.com", "maildrop.cc", "mailnull.com",
  "spamgourmet.com", "spamgourmet.net", "spamgourmet.org", "bouncr.com",
  "discard.email", "fakeinbox.com", "mailnesia.com", "spamfree24.org",
  "wegwerfmail.de", "wegwerfmail.net", "wegwerfmail.org", "mailexpire.com",
  "spamex.com", "filzmail.com", "spamthisplease.com", "noref.in",
  "spamevader.com", "mailnull.com", "getairmail.com", "tmailinator.com",
  "tempinbox.com", "throwam.com", "mt2014.com", "mt2015.com",
  "dispostable.com", "trashmail.at", "spambob.com", "spamhole.com",
  "mailzilla.com", "spaml.com", "spamstack.net", "spamsink.net",
  "objectmail.com", "ownmail.net", "maileater.com", "mailscrap.com",
  "spamoff.de", "fakemail.net", "supergreatmail.com", "garbagemail.org",
  "hatespam.org", "ieatspam.eu", "ieatspam.info", "inoutmail.de",
  "spamgob.com", "spam.la", "thisisnotmyrealemail.com", "fauxmail.com",
  "mintemail.com", "tempemail.net", "incognitomail.com",
]);

/** Returns an error string or empty string if valid. */
function validateEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  // Basic format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return "Enter a valid email address.";
  const domain = trimmed.split("@")[1];
  if (BLOCKED_DOMAINS.has(domain)) return "Temporary / disposable email addresses are not allowed.";
  return "";
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    representative_name: "",  // matches backend field
    company_name: "",
    email: "",
    phone_number: "",         // matches backend field
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  /** Phone: only allow digits, spaces, +, -, () */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d\s+()\-]/g, "");
    setForm({ ...form, phone_number: cleaned });
    setFieldErrors((prev) => ({ ...prev, phone_number: "" }));
    setError("");
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.representative_name.trim()) errs.representative_name = "Full name is required.";
    if (!form.company_name.trim()) errs.company_name = "Company name is required.";
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.phone_number.trim()) errs.phone_number = "Phone number is required.";
    else if (form.phone_number.replace(/[^\d]/g, "").length < 7) errs.phone_number = "Enter a valid phone number.";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    try {
      await register({
        representative_name: form.representative_name,
        company_name: form.company_name,
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
      });
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err: any) {
      const data = err.response?.data;
      setError(
        data?.message || data?.email?.[0] || data?.detail ||
        Object.values(data || {})?.[0]?.[0] ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Register for the exhibition platform</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="representative_name" value={form.representative_name} onChange={handleChange} placeholder="John Doe"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.representative_name ? "border-red-500" : "border-gray-200"}`} />
                {fieldErrors.representative_name && <p className="text-red-500 text-xs mt-1">{fieldErrors.representative_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" name="company_name" value={form.company_name} onChange={handleChange} placeholder="Acme Inc."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.company_name ? "border-red-500" : "border-gray-200"}`} />
                {fieldErrors.company_name && <p className="text-red-500 text-xs mt-1">{fieldErrors.company_name}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.email ? "border-red-500" : "border-gray-200"}`} />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" name="phone_number" value={form.phone_number} onChange={handlePhoneChange} placeholder="+91 98765 43210" inputMode="tel"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.phone_number ? "border-red-500" : "border-gray-200"}`} />
              {fieldErrors.phone_number && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone_number}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.password ? "border-red-500" : "border-gray-200"}`} />
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.confirmPassword ? "border-red-500" : "border-gray-200"}`} />
              {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;