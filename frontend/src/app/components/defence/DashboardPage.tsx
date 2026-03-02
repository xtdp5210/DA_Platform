import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../store/authStore";
import { getMyBookings } from "../../../api/exhibitions";
import { createOrder, verifyPayment } from "../../../api/payments";

declare global { interface Window { Razorpay: any; } }

type ApprovalStatus = "pending_review" | "approved" | "rejected";
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

  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePayNow = async (booking: Booking) => {
    setPayingId(booking.id);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { alert("Failed to load payment gateway."); return; }

      const { data: order } = await createOrder(booking.id);

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: "INR",
        name: "Defence Tech Exhibition",
        description: `Stall ${booking.stall_number} - Block ${booking.block}`,
        order_id: order.razorpay_order_id,
        handler: async (response: any) => {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              registration_id: booking.id,
            });
            await fetchBookings();
          } catch { alert("Payment verification failed. Contact support."); }
        },
        prefill: { email: user?.email },
        theme: { color: "#C24F1D" }, // Match brand color
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error", err);
      alert("Unable to initiate payment. Please try again.");
    } finally {
      setPayingId(null);
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
                      {isApproved && !isPaid && (
                        <p className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 leading-relaxed">
                          ✅ Your application has been approved! Please complete the payment below to confirm your stall booking.
                        </p>
                      )}
                    </div>

                    {/* Card Action Footer */}
                    <div className="p-5 pt-0">
                      {isPaid ? (
                        booking.receipt_url ? (
                          <a href={booking.receipt_url} target="_blank" rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#0A1628] hover:bg-[#0A1628] hover:text-white text-[#0A1628] font-bold py-2.5 rounded-xl text-sm transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Receipt
                          </a>
                        ) : (
                          <div className="w-full text-center bg-gray-50 border border-gray-100 text-gray-400 font-semibold py-2.5 rounded-xl text-sm">
                            Receipt Generating...
                          </div>
                        )
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
                      ) : isPendingReview ? (
                        <div className="w-full text-center bg-yellow-50 border border-yellow-200 text-yellow-600 font-semibold py-2.5 rounded-xl text-sm cursor-not-allowed">
                          Awaiting Admin Approval
                        </div>
                      ) : canPay ? (
                        <button onClick={() => handlePayNow(booking)} disabled={payingId === booking.id}
                          className="w-full bg-[#C24F1D] hover:bg-[#a64015] disabled:bg-[#C24F1D]/60 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-orange-900/20 active:scale-95 flex justify-center items-center gap-2">
                          {payingId === booking.id ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Connecting Gateway...</>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              PAY NOW TO CONFIRM
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
    </div>
  );
};

export default DashboardPage;