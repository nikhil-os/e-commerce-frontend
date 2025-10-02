"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

// Force dynamic rendering
export const dynamic = "force-dynamic";

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (orderIdParam) {
      setOrderId(orderIdParam);
    } else {
      router.push("/checkout");
    }
  }, [searchParams, router]);

  const handlePayment = async () => {
    if (!orderId) {
      toast.error("No order ID found");
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay payment order
      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ method: "online" }),
          credentials: "include",
        }
      );

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        toast.error(paymentData.message || "Failed to create payment order");
        return;
      }

      // Open Razorpay checkout
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: "Scratch E-Commerce",
          description: `Order #${orderId}`,
          order_id: paymentData.id,
          handler: function (response) {
            // Payment successful
            console.log("Payment response:", response);
            router.push(
              `/order-success?orderId=${orderId}&paymentId=${response.razorpay_payment_id}`
            );
            toast.success("Payment completed successfully!");
          },
          prefill: {
            name: user?.fullName || "",
            email: user?.email || "",
          },
          theme: {
            color: "#ff6b9d",
          },
          modal: {
            ondismiss: function () {
              toast.warning("Payment cancelled");
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Razorpay not loaded. Please refresh and try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] relative overflow-hidden">
        {/* Cosmic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#ff6b9d] opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-[#c77dff] opacity-10 blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 pt-8 pb-16">
          <div className="max-w-2xl mx-auto px-4">
            {/* Payment Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
              <h1 className="text-3xl font-bold text-white mb-8 text-center">
                Complete Payment
              </h1>

              {orderId && (
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Order ID</p>
                  <p className="text-white font-mono text-lg font-semibold">
                    {orderId}
                  </p>
                </div>
              )}

              {/* Payment Methods */}
              <div className="mb-8">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Select Payment Method
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
                        💳
                      </div>
                      <span className="text-white">Credit/Debit Card</span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded mr-3 flex items-center justify-center">
                        📱
                      </div>
                      <span className="text-white">UPI Payment</span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked={paymentMethod === "wallet"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded mr-3 flex items-center justify-center">
                        👛
                      </div>
                      <span className="text-white">Digital Wallet</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.back()}
                  className="bg-white/10 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium border border-white/20"
                >
                  Back to Checkout
                </button>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white px-8 py-3 rounded-xl hover:from-[#ff5588] hover:to-[#ff9fcc] transition-all duration-300 font-medium flex-1 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Complete Payment"
                  )}
                </button>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="text-white mt-4">Loading payment page...</p>
              </div>
            </div>
          </div>
        </Layout>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
