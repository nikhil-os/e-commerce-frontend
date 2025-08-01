"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { useToast } from "../contexts/ToastContext";

const paymentMethods = [
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: "💵",
    description: "Pay when you receive your order",
    type: "offline",
  },
  {
    id: "razorpay",
    name: "Credit/Debit Card",
    icon: "💳",
    description: "Secure payment with Razorpay",
    type: "online",
  },
  {
    id: "upi",
    name: "UPI Payment",
    icon: "📱",
    description: "GPay, PhonePe, Paytm & more",
    type: "online",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    icon: "🏦",
    description: "All major banks supported",
    type: "online",
  },
];

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [selected, setSelected] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (!orderIdParam) {
      setError("Order ID is missing. Please go back to checkout.");
      setLoading(false);
      return;
    }

    setOrderId(orderIdParam);

    // Fetch order details from the backend
    fetch(`http://localhost:5000/api/checkout/order/${orderIdParam}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order details");
        return res.json();
      })
      .then((data) => {
        setOrderDetails(data.order);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
        // Don't treat this as a fatal error - proceed with just the order ID
        setOrderDetails({ id: orderIdParam, amount: 0 });
        setLoading(false);
      });
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) {
      toast.warning("⚠️ Please select a payment method");
      return;
    }

    setProcessingPayment(true);

    try {
      // If COD, simply confirm the order
      if (selected === "cod") {
        const response = await fetch(
          `http://localhost:5000/api/payment/cod/${orderId}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        let data;
        try {
          const responseText = await response.text();
          if (responseText.trim()) {
            data = JSON.parse(responseText);
          } else {
            data = { success: response.ok, message: "Payment processed" };
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          data = { success: response.ok, message: "Payment processed" };
        }

        if (response.ok || data.success) {
          router.push("/payment-success?orderId=" + orderId + "&method=cod");
        } else {
          toast.error(data.message || "💳 Payment failed");
        }
      } else {
        // For online payments, create Razorpay order
        console.log(
          "Making payment request for method:",
          selected,
          "orderId:",
          orderId
        ); // Debug log
        const response = await fetch(
          `http://localhost:5000/api/payment/create/${orderId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ method: selected }),
            credentials: "include",
          }
        );

        console.log(
          "Response status:",
          response.status,
          "Response OK:",
          response.ok
        ); // Debug log

        let data;
        try {
          const responseText = await response.text();
          console.log("Backend response:", responseText); // Debug log
          if (responseText.trim()) {
            data = JSON.parse(responseText);
            console.log("Parsed data:", data); // Debug log
          } else {
            throw new Error("Empty response from server");
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          throw new Error("Invalid response from server");
        }

        console.log(
          "Response OK:",
          response.ok,
          "Data success:",
          data.success,
          "Has razorpayOrder:",
          !!data.razorpayOrder
        ); // Debug log

        if (response.ok && data.success && data.razorpayOrder) {
          // Initialize Razorpay
          const options = {
            key: data.key, // Razorpay key from backend
            amount: data.razorpayOrder.amount,
            currency: data.razorpayOrder.currency,
            name: "CosmicShop",
            description: `Order #${orderId}`,
            order_id: data.razorpayOrder.id,
            handler: function (response) {
              // Payment successful
              verifyPayment(response);
            },
            prefill: {
              name: orderDetails?.user?.name || "",
              email: orderDetails?.user?.email || "",
              contact: orderDetails?.user?.phone || "",
            },
            theme: {
              color: "#8f6690",
            },
            modal: {
              ondismiss: function () {
                setProcessingPayment(false);
              },
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } else {
          // Show specific error message from backend
          const errorMessage = data.message || "Payment initiation failed";
          console.error("Payment initiation failed:", errorMessage, data);

          // If cart is empty, suggest going back to add items
          if (errorMessage.includes("Cart is empty")) {
            if (
              confirm(
                "Your cart appears to be empty. Would you like to go back to shopping?"
              )
            ) {
              router.push("/");
              return;
            }
          }

          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("💳 Payment failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  const verifyPayment = async (razorpayResponse) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push(
          `/payment-success?orderId=${orderId}&method=${selected}&paymentId=${razorpayResponse.razorpay_payment_id}`
        );
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Payment verification failed. Please contact support.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#8f6690] to-[#b278a8] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8f6690] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#8f6690] to-[#b278a8] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-[#8f6690] text-white px-6 py-3 rounded-full hover:bg-[#7a5579] transition-all duration-300 transform hover:scale-105"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#8f6690] to-[#b278a8] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              💳 Secure Payment
            </h1>
            <p className="text-white/80 text-lg">
              Choose your preferred payment method
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  � Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-[#8f6690]">#{orderId}</span>
                  </div>
                  {orderDetails?.amount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-green-600">
                        ₹{orderDetails.amount}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-[#8f6690]">
                        ₹{orderDetails?.amount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`relative cursor-pointer transition-all duration-300 ${
                          selected === method.id
                            ? "transform scale-[1.02]"
                            : "hover:transform hover:scale-[1.01]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="method"
                          value={method.id}
                          checked={selected === method.id}
                          onChange={() => setSelected(method.id)}
                          className="sr-only"
                          required
                        />
                        <div
                          className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                            selected === method.id
                              ? "border-[#8f6690] bg-gradient-to-r from-[#8f6690]/10 to-[#b278a8]/10 shadow-lg"
                              : "border-gray-200 hover:border-[#8f6690]/50 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{method.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 text-lg">
                                {method.name}
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {method.description}
                              </p>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                                selected === method.id
                                  ? "border-[#8f6690] bg-[#8f6690]"
                                  : "border-gray-300"
                              }`}
                            >
                              {selected === method.id && (
                                <div className="w-full h-full rounded-full bg-white scale-[0.4]"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={!selected || processingPayment}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                        !selected || processingPayment
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {processingPayment ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>🔒</span>
                          <span>
                            {selected === "cod"
                              ? "Confirm Order"
                              : "Pay Securely"}
                          </span>
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-500 pt-4">
                    <p className="flex items-center justify-center space-x-2">
                      <span>🔐</span>
                      <span>
                        Your payment information is secure and encrypted
                      </span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
