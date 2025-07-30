"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Layout from "../components/Layout";

const methods = ["cod", "gpay", "phonepe", "slice"];

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      alert("Please select a payment method");
      return;
    }

    setLoading(true);

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

        // Handle response with better error handling
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
          router.push("/payment-success?orderId=" + orderId);
        } else {
          alert(data.message || "Payment failed");
        }
      } else {
        // For online payments, initiate Razorpay or other payment gateway
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

        // Handle response with better error handling
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
          // Implement Razorpay or redirect to payment gateway
          // For now, we'll simulate success
          router.push("/payment-success?orderId=" + orderId);
        } else {
          alert(data.message || "Payment initiation failed");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          💳 Choose Payment Method
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {methods.map((method) => (
            <label key={method} className="flex items-center space-x-3">
              <input
                type="radio"
                name="method"
                value={method}
                checked={selected === method}
                onChange={() => setSelected(method)}
                required
              />
              <span>{method.toUpperCase()}</span>
            </label>
          ))}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
