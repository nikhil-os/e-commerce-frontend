"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPageWithSuspense() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method");
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("paymentId");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getPaymentMethodDisplay = (method) => {
    switch (method?.toLowerCase()) {
      case "cod":
        return {
          name: "Cash on Delivery",
          icon: "💵",
          color: "text-green-600",
        };
      case "razorpay":
        return { name: "Card Payment", icon: "💳", color: "text-blue-600" };
      case "upi":
        return { name: "UPI Payment", icon: "📱", color: "text-purple-600" };
      case "netbanking":
        return { name: "Net Banking", icon: "🏦", color: "text-indigo-600" };
      default:
        return { name: "Online Payment", icon: "💰", color: "text-gray-600" };
    }
  };

  const paymentInfo = getPaymentMethodDisplay(method);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#8f6690] to-[#b278a8] flex items-center justify-center px-4 py-8">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-10">
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    backgroundColor: [
                      "#8f6690",
                      "#b278a8",
                      "#C9BBF7",
                      "#FF6B8E",
                      "#FFD700",
                      "#00FF7F",
                    ][Math.floor(Math.random() * 6)],
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-auto text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#8f6690] rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#b278a8] rounded-full translate-x-20 translate-y-20"></div>
          </div>

          <div className="relative z-10">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🎉 Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your order. We&apos;re processing it now!
            </p>

            {/* Order Details Card */}
            <div className="bg-gradient-to-r from-[#8f6690]/10 to-[#b278a8]/10 rounded-2xl p-6 mb-8 border border-[#8f6690]/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Details
              </h3>

              <div className="space-y-3">
                {orderId && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-[#8f6690] font-bold bg-white px-3 py-1 rounded-full">
                      #{orderId}
                    </span>
                  </div>
                )}

                {method && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Payment Method:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{paymentInfo.icon}</span>
                      <span className={`font-semibold ${paymentInfo.color}`}>
                        {paymentInfo.name}
                      </span>
                    </div>
                  </div>
                )}

                {paymentId && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-gray-800 text-sm bg-white px-3 py-1 rounded-full">
                      {paymentId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-semibold">
                      Confirmed
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                🛍️ Continue Shopping
              </button>

              <button
                onClick={() => router.push("/users/profile")}
                className="w-full border-2 border-[#8f6690] text-[#8f6690] py-3 rounded-xl font-semibold hover:bg-[#8f6690] hover:text-white transition-all duration-300"
              >
                📋 View Order History
              </button>
            </div>

            {/* Footer Message */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                📧 Order confirmation has been sent to your email
              </p>
              <p className="text-xs text-gray-400">
                Need help? Contact our support team
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .confetti-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear infinite;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </Layout>
  );
}
