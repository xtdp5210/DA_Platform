import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../store/authStore";
import { getMyBookings } from "../../../api/exhibitions";
import { generateUpiQR, submitUpiPayment, type UpiQRResponse } from "../../../api/payments";


// ── Countdown helper for 24-hour payment deadline ─────────────────────────────
function useDeadlineCountdown(deadline: string | null) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!deadline) { setRemaining(null); return; }
    const target = new Date(deadline).getTime();

    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setRemaining(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return remaining;
}

function formatDeadline(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function PaymentDeadlineCountdown({ deadline }: { deadline: string | null }) {
  const remaining = useDeadlineCountdown(deadline);

  if (remaining === null) return null;
  if (remaining === 0) {
    return (
      <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-[11px] text-purple-700 leading-relaxed">
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span><strong>Payment deadline has passed.</strong> Your stall will be released shortly.</span>
      </div>
    );
  }

  const isUrgent = remaining < 3600000; // less than 1 hour
  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] leading-relaxed ${
      isUrgent
        ? "bg-red-50 border border-red-200 text-red-700"
        : "bg-amber-50 border border-amber-200 text-amber-700"
    }`}>
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        <strong>Payment deadline:</strong>{" "}
        <span className="font-mono font-bold tabular-nums">{formatDeadline(remaining)}</span> remaining
      </span>
    </div>
  );
}


type ApprovalStatus = "pending_review" | "approved" | "rejected" | "expired";
type PaymentStatus  = "unpaid" | "processing" | "paid";

interface Booking {
  id: number;
  company_name: string;
  stall_number: string;
  block: string;
  stall_price: string | number;
  approval_status: ApprovalStatus;
  payment_status: PaymentStatus;
  created_at: string;
  approved_at: string | null;
  payment_deadline: string | null;
  receipt_url: string | null;
}

// ── Combined status display based on both approval + payment ──────────────────
function getStatusConfig(booking: Booking) {
  const { approval_status, payment_status } = booking;

  if (payment_status === "paid") {
    return {
      label: "Booking Confirmed",
      bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
    };
  }

  if (payment_status === "processing") {
    return {
      label: "Verifying Payment",
      bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200",
      icon: (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    };
  }

  if (approval_status === "pending_review") {
    return {
      label: "Under Verification",
      bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
  }

  if (approval_status === "rejected") {
    return {
      label: "Application Rejected",
      bg: "bg-red-50", text: "text-red-700", border: "border-red-200",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    };
  }

  if (approval_status === "expired") {
    return {
      label: "Expired — Deadline Missed",
      bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
  }

  // approved + unpaid
  return {
    label: "Approved — Pay Now",
    bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
}

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [payingId, setPayingId] = useState<number | null>(null);

  // UPI QR modal state
  const [qrModalOpen, setQrModalOpen]     = useState(false);
  const [qrActiveId, setQrActiveId]       = useState<number | null>(null);
  const [qrData, setQrData]               = useState<UpiQRResponse | null>(null);
  const [qrLoading, setQrLoading]         = useState(false);
  const [qrError, setQrError]             = useState("");
  const [utrValue, setUtrValue]           = useState("");
  const [payerUpi, setPayerUpi]           = useState("");
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [utrError, setUtrError]           = useState("");
  const [utrSuccess, setUtrSuccess]       = useState(false);
  const [countdown, setCountdown]         = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // ── QR countdown ticker ────────────────────────────────────────────────────
  const startCountdown = (expiresAt: number) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    const tick = () => {
      const remaining = Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
      setCountdown(remaining);
      if (remaining === 0 && countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
    tick();
    countdownRef.current = setInterval(tick, 1000);
  };

  const closeQrModal = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setQrModalOpen(false);
    setQrData(null);
    setQrActiveId(null);
    setQrError("");
    setUtrValue("");
    setPayerUpi("");
    setUtrError("");
    setUtrSuccess(false);
    setCountdown(0);
  };

  const handleOpenQR = async (booking: Booking) => {
    setQrModalOpen(true);
    setQrActiveId(booking.id);
    setQrLoading(true);
    setQrData(null);
    setQrError("");
    setUtrValue("");
    setPayerUpi("");
    setUtrError("");
    setUtrSuccess(false);
    setPayingId(booking.id);
    try {
      const { data } = await generateUpiQR(booking.id);
      setQrData(data);
      startCountdown(data.expires_at);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to generate QR. Please try again.";
      setQrError(msg);
    } finally {
      setQrLoading(false);
      setPayingId(null);
    }
  };

  const handleSubmitUtr = async () => {
    if (!utrValue.trim() || utrValue.trim().length < 8) {
      setUtrError("Enter a valid UTR / transaction reference number (at least 8 characters).");
      return;
    }
    if (!qrActiveId || !qrData) return;
    setSubmittingUtr(true);
    setUtrError("");
    try {
      await submitUpiPayment({
        registration_id : qrActiveId,
        utr_number      : utrValue.trim(),
        payer_upi_id    : payerUpi.trim(),
        transaction_note: qrData.transaction_note,
      });
      setUtrSuccess(true);
      await fetchBookings();
    } catch (err: any) {
      const data = err?.response?.data;
      setUtrError(
        data?.utr_number?.[0] ||
        data?.error          ||
        data?.detail         ||
        "Submission failed. Please try again.",
      );
    } finally {
      setSubmittingUtr(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f4] font-sans">
      
      {/* Premium Dark Navbar */}
      <nav className="bg-[#0A1628] border-b border-white/10 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#C9933A] text-[9px] font-bold tracking-[0.2em] uppercase">Defence Attaché Roundtable 2026</span>
            <span className="text-white text-sm sm:text-base font-bold tracking-wide">Exhibitor Portal</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-gray-400">Logged in as</span>
              <span className="text-sm font-semibold text-white">{user?.email}</span>
            </div>
            <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
            <button onClick={logout} className="text-sm text-gray-300 hover:text-white flex items-center gap-2 transition-colors font-semibold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* Welcome & Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1628] tracking-tight">
              Welcome back, {user?.representative_name?.split(' ')[0] || 'Exhibitor'}
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your stall reservations and complete pending payments here.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h2 className="text-[11px] font-extrabold text-gray-400 tracking-widest uppercase">Company Profile</h2>
              <Link to="/profile" className="text-xs text-[#C24F1D] hover:underline font-bold tracking-wide">EDIT INFO</Link>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Representative</p>
                <p className="font-semibold text-[#0A1628] text-sm">{user?.representative_name || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Registered Email</p>
                <p className="font-semibold text-[#0A1628] text-sm">{user?.email || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0A1628]">My Reserved Stalls</h2>
              <p className="text-sm text-gray-500 mt-1">Review your allocated spaces and manage invoices.</p>
            </div>
            <Link to="/registerevent"
              className="inline-flex items-center justify-center gap-2 bg-[#C24F1D] hover:bg-[#a64015] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-900/20 active:scale-95">
              <span>+ BOOK NEW STALL</span>
            </Link>
          </div>

          {bookingsLoading ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#C24F1D] mb-4" />
              <p className="text-gray-500 font-medium animate-pulse">Loading your reservations...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-[#C24F1D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-[#0A1628] mb-2">No stalls reserved yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't booked any exhibition space. Secure your spot at the Roundtable by reserving a stall today.</p>
              <Link to="/registerevent"
                className="inline-flex items-center gap-2 bg-[#0A1628] hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg">
                View Layout & Register
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => {
                const statusDisplay = getStatusConfig(booking);
                const isPaid         = booking.payment_status === "paid";
                const isProcessing   = booking.payment_status === "processing";
                const isApproved     = booking.approval_status === "approved";
                const isRejected     = booking.approval_status === "rejected";
                const isExpired      = booking.approval_status === "expired";
                const isPendingReview = booking.approval_status === "pending_review";
                const canPay = isApproved && !isPaid && !isProcessing;

                return (
                  <div key={booking.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden group">
                    
                    {/* Card Header */}
                    <div className="bg-slate-50 border-b border-gray-100 p-5 flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Stall Number</p>
                        <p className="text-3xl font-black text-[#0A1628] tracking-tight">{booking.stall_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Block</p>
                        <p className="text-xl font-extrabold text-[#C24F1D]">{booking.block}</p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Company</p>
                        <p className="text-sm font-semibold text-gray-900 truncate" title={booking.company_name}>
                          {booking.company_name}
                        </p>
                      </div>

                      {/* Stall price */}
                      {booking.stall_price && !isPaid && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Stall Fee</p>
                          <p className="text-sm font-bold text-gray-800">
                            ₹{Number(booking.stall_price).toLocaleString("en-IN")}
                          </p>
                        </div>
                      )}

                      {/* Status badge */}
                      <div className="mt-auto pt-4 border-t border-gray-50">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${statusDisplay.bg} ${statusDisplay.text} ${statusDisplay.border} w-full justify-center`}>
                          {statusDisplay.icon}
                          <span className="text-xs font-bold tracking-wide">{statusDisplay.label}</span>
                        </div>
                      </div>

                      {/* Contextual info messages */}
                      {isPendingReview && (
                        <p className="text-[11px] text-yellow-700 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 leading-relaxed">
                          ⏳ Your application is being reviewed by our team. You will receive an email once a decision has been made.
                        </p>
                      )}
                      {isRejected && (
                        <p className="text-[11px] text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2 leading-relaxed">
                          ✗ Your application was not approved. Please check your email for details or contact <a href="mailto:da@rru.ac.in" className="underline font-semibold">da@rru.ac.in</a>.
                        </p>
                      )}
                      {isExpired && (
                        <p className="text-[11px] text-purple-700 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 leading-relaxed">
                          ⏰ Your stall allocation has been released because payment was not completed within 24 hours. You may <Link to="/registerevent" className="underline font-semibold">register for another stall</Link>.
                        </p>
                      )}
                      {isApproved && !isPaid && !isProcessing && (
                        <>
                          <p className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 leading-relaxed">
                            ✅ Your application has been approved! Please complete the payment below to confirm your stall booking.
                          </p>
                          <PaymentDeadlineCountdown deadline={booking.payment_deadline} />
                        </>
                      )}
                    </div>

                    {/* Card Action Footer */}
                    <div className="p-5 pt-0">
                      {isPaid ? (
                        <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold py-2.5 rounded-xl text-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Receipt Emailed ✓
                        </div>
                      ) : isProcessing ? (
                        <div className="w-full flex items-center justify-center gap-2 bg-amber-100 text-amber-800 font-bold py-2.5 rounded-xl text-sm">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Verifying Payment
                        </div>
                      ) : isRejected ? (
                        <div className="w-full text-center bg-red-50 border border-red-200 text-red-500 font-semibold py-2.5 rounded-xl text-sm cursor-not-allowed">
                          Application Not Approved
                        </div>
                      ) : isExpired ? (
                        <Link to="/registerevent"
                          className="w-full flex items-center justify-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-purple-100 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Register Another Stall
                        </Link>
                      ) : isPendingReview ? (
                        <div className="w-full text-center bg-yellow-50 border border-yellow-200 text-yellow-600 font-semibold py-2.5 rounded-xl text-sm cursor-not-allowed">
                          Awaiting Admin Approval
                        </div>
                      ) : canPay ? (
                        <button
                          onClick={() => handleOpenQR(booking)}
                          disabled={payingId === booking.id}
                          className="w-full bg-[#C24F1D] hover:bg-[#a64015] disabled:bg-[#C24F1D]/60 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-orange-900/20 active:scale-95 flex justify-center items-center gap-2"
                        >
                          {payingId === booking.id ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating QR...</>
                          ) : (
                            <>
                              {/* QR icon */}
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <path strokeLinecap="round" d="M14 14h2m3 0h2M14 17v2m0 3h2m3-3h2m0 3h-2" />
                              </svg>
                              PAY NOW — SCAN QR
                            </>
                          )}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── UPI QR Payment Modal ──────────────────────────────────────────── */}
      {qrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget && !submittingUtr) closeQrModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal header */}
            <div className="bg-[#0A1628] px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[#C9933A] text-[10px] font-bold tracking-[0.2em] uppercase">Defence Attaché Roundtable 2026</p>
                <p className="text-white font-bold text-base">Pay via UPI / Bank Transfer</p>
              </div>
              {!submittingUtr && (
                <button
                  onClick={closeQrModal}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="p-6">

              {/* ── SUCCESS STATE ── */}
              {utrSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-2">Reference Submitted!</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Our accounts department will verify your UTR against the bank statement and confirm your stall within <strong>1 business day</strong>. You will receive a confirmation email.
                  </p>
                  <button
                    onClick={closeQrModal}
                    className="bg-[#0A1628] hover:bg-gray-800 text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>

              ) : qrLoading ? (
                /* ── LOADING ── */
                <div className="flex flex-col items-center py-12 gap-4">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C24F1D] rounded-full animate-spin" />
                  <p className="text-gray-500 text-sm font-medium">Generating secure QR code…</p>
                </div>

              ) : qrError ? (
                /* ── ERROR ── */
                <div className="text-center py-8">
                  <p className="text-red-600 font-semibold mb-4">{qrError}</p>
                  <button
                    onClick={() => { setQrError(''); qrActiveId && handleOpenQR(bookings.find(b => b.id === qrActiveId)!); }}
                    className="bg-[#C24F1D] hover:bg-[#a64015] text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                  >
                    Retry
                  </button>
                </div>

              ) : qrData ? (
                /* ── QR CODE + UTR FORM ── */
                <>
                  {/* Amount badge */}
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5">
                    <div>
                      <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">Stall {qrData.stall_number} — Block {qrData.block}</p>
                      <p className="text-2xl font-black text-[#0A1628]">₹{Number(qrData.amount).toLocaleString('en-IN')}</p>
                    </div>
                    {/* Countdown */}
                    <div className={`text-center ${countdown < 60 ? 'text-red-600' : 'text-gray-600'}`}>
                      <p className="text-[10px] font-bold uppercase tracking-wider">Expires in</p>
                      <p className="text-xl font-black tabular-nums">
                        {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                      </p>
                    </div>
                  </div>

                  {countdown === 0 ? (
                    <div className="text-center bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                      <p className="text-red-700 font-semibold text-sm">QR code has expired.</p>
                      <button onClick={() => handleOpenQR(bookings.find(b => b.id === qrActiveId)!)} className="mt-2 text-sm font-bold text-red-700 underline">
                        Generate a new QR
                      </button>
                    </div>
                  ) : (
                    /* QR image */
                    <div className="flex flex-col items-center mb-5">
                      <div className="border-4 border-[#0A1628] rounded-xl p-2 bg-white shadow-lg">
                        <img
                          src={qrData.qr_code}
                          alt="UPI Payment QR Code"
                          className="w-52 h-52 object-contain"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Scan with GPay · PhonePe · Paytm · Any UPI app</p>
                    </div>
                  )}

                  {/* Manual bank details (NEFT fallback) */}
                  <details className="mb-5 border border-gray-200 rounded-xl overflow-hidden">
                    <summary className="px-4 py-2.5 text-xs font-bold text-gray-600 cursor-pointer select-none hover:bg-gray-50 uppercase tracking-wider">
                      Can't scan? — Manual bank transfer details
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 space-y-2">
                      {[
                        { label: 'Account Name',   value: qrData.bank_name },
                        { label: 'Account Number', value: qrData.bank_account_no },
                        { label: 'IFSC Code',      value: qrData.bank_ifsc },
                        { label: 'Bank',           value: 'HDFC Bank' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-500">{label}</span>
                          <code className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded font-mono select-all text-gray-800">{value}</code>
                        </div>
                      ))}
                      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
                        ⚠ Use <strong>{qrData.transaction_note.substring(0, 24)}…</strong> as the payment remark/narration so our accounts team can identify your transfer.
                      </p>
                    </div>
                  </details>

                  {/* UTR input section */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold text-gray-700 tracking-wide uppercase mb-3">After Payment — Enter Transaction Reference</p>

                    <div className="mb-3">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        UTR / Reference Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={utrValue}
                        onChange={(e) => { setUtrValue(e.target.value); setUtrError(''); }}
                        placeholder="e.g. 423917263845"
                        className={`w-full px-3 py-2.5 rounded-lg border text-sm font-mono outline-none transition-all focus:ring-2 focus:ring-[#C24F1D] ${
                          utrError ? 'border-red-400' : 'border-gray-300'
                        }`}
                      />
                      <p className="text-[11px] text-gray-400 mt-1">Find this in your banking app under transaction history.</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your UPI ID (optional)</label>
                      <input
                        type="text"
                        value={payerUpi}
                        onChange={(e) => setPayerUpi(e.target.value)}
                        placeholder="yourname@bank"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none transition-all focus:ring-2 focus:ring-[#C24F1D]"
                      />
                    </div>

                    {utrError && (
                      <p className="text-red-600 text-xs font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{utrError}</p>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={closeQrModal}
                        disabled={submittingUtr}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitUtr}
                        disabled={submittingUtr || countdown === 0}
                        className="flex-[2] bg-[#C24F1D] hover:bg-[#a64015] disabled:bg-[#C24F1D]/60 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                      >
                        {submittingUtr ? (
                          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                        ) : (
                          '✓ I\'ve Paid — Confirm'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;