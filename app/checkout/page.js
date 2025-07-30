"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { user, cartItems } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch addresses when component mounts
  useEffect(() => {
    if (!user) {
      router.push("/users/login");
      return;
    }

    // Fetch user's saved addresses
    fetch("http://localhost:5000/api/checkout/addresses", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data.addresses || []);
        if (data.addresses && data.addresses.length > 0) {
          // Set the default address as selected, or the first one
          const defaultAddress =
            data.addresses.find((addr) => addr.isDefault) || data.addresses[0];
          setSelectedAddress(data.addresses.indexOf(defaultAddress));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching checkout data:", err);
        setError("Failed to load checkout data. Please try again.");
        setLoading(false);
      });
  }, [user, router]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/checkout/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAddresses([...addresses, data.address]);
        setSelectedAddress(addresses.length); // Select the newly added address
        setForm({
          fullName: "",
          mobile: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          isDefault: false,
        }); // Reset form
        alert("Address saved successfully!");
      } else {
        alert(data.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total whenever cart items change
  useEffect(() => {
    if (cartItems) {
      setTotal(
        cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      );
    }
  }, [cartItems]);

  const handlePayment = async () => {
    if (selectedAddress === null) {
      alert("Please select an address for delivery");
      return;
    }

    setLoading(true);

    try {
      // Calculate the total amount for the order
      const total =
        cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ) + 50; // Adding delivery charge

      const response = await fetch(
        "http://localhost:5000/api/checkout/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressId: addresses[selectedAddress]._id,
            total: total, // Send the total amount to the backend
          }),
          credentials: "include",
        }
      );

      // Check if the response is JSON
      let data;
      try {
        const responseText = await response.text();
        console.log("Create order response:", responseText);

        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText);
          console.log("Order data:", data);
        } else {
          console.error("Empty response received");
          throw new Error("Empty response from server");
        }

        if (response.ok) {
          // Redirect to payment page with order ID
          if (data.order && data.order.id) {
            window.location.href = `/payment?orderId=${data.order.id}`;
          } else {
            console.error("Invalid order data:", data);
            alert("Invalid order data received from server");
          }
        } else {
          alert(data.message || "Failed to create order");
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        alert("Unexpected response format. Check console for details.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#8f6690] to-[#b278a8] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8f6690] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading checkout...</p>
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
              onClick={() => window.location.reload()}
              className="bg-[#8f6690] text-white px-6 py-3 rounded-full hover:bg-[#7a5579] transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#8f6690] to-[#b278a8] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🛒 Checkout</h1>
            <p className="text-white/80 text-lg">
              Review your order and complete your purchase
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Address Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Existing Addresses */}
              {addresses.length > 0 && (
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    📍 Delivery Address
                  </h3>
                  <div className="space-y-3">
                    {addresses.map((addr, i) => (
                      <label
                        key={i}
                        className={`block cursor-pointer transition-all duration-300 ${
                          selectedAddress === i
                            ? "transform scale-[1.02]"
                            : "hover:transform hover:scale-[1.01]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={i}
                          checked={selectedAddress === i}
                          onChange={() => setSelectedAddress(i)}
                          className="sr-only"
                        />
                        <div
                          className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                            selectedAddress === i
                              ? "border-[#8f6690] bg-gradient-to-r from-[#8f6690]/10 to-[#b278a8]/10 shadow-lg"
                              : "border-gray-200 hover:border-[#8f6690]/50 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">
                                {addr.fullName}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1">
                                {addr.street}, {addr.city}, {addr.state}{" "}
                                {addr.zip}
                              </p>
                              <p className="text-gray-500 text-sm">
                                📱 {addr.mobile}
                              </p>
                              {addr.isDefault && (
                                <span className="inline-block bg-[#8f6690] text-white text-xs px-2 py-1 rounded-full mt-2">
                                  Default
                                </span>
                              )}
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 mt-1 transition-all duration-300 ${
                                selectedAddress === i
                                  ? "border-[#8f6690] bg-[#8f6690]"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedAddress === i && (
                                <div className="w-full h-full rounded-full bg-white scale-[0.4]"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* New Address Form */}
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    📬 Add New Address
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        required
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#8f6690] transition-colors duration-300"
                        value={form.fullName}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        placeholder="9876543210"
                        required
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#8f6690] transition-colors duration-300"
                        value={form.mobile}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        placeholder="123 Main St"
                        required
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#8f6690] transition-colors duration-300"
                        value={form.street}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Mumbai"
                        required
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#8f6690] transition-colors duration-300"
                        value={form.city}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="Maharashtra"
                        required
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#8f6690] transition-colors duration-300"
                        value={form.state}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zip"
                        placeholder="400001"
                        required
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#8f6690] transition-colors duration-300"
                        value={form.zip}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        placeholder="India"
                        required
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#8f6690] transition-colors duration-300"
                        value={form.country}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center pt-4">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      className="w-4 h-4 text-[#8f6690] border-gray-300 rounded focus:ring-[#8f6690] mr-3"
                      checked={form.isDefault}
                      onChange={handleFormChange}
                    />
                    <label
                      htmlFor="isDefault"
                      className="text-sm text-gray-700"
                    >
                      Make this my default address
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      💾 Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  🧾 Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {item.product.name}
                        </h4>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.quantity} × ₹{item.product.price}
                        </p>
                      </div>
                      <p className="font-bold text-[#8f6690]">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-semibold">₹50</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-[#8f6690]">₹{total + 50}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  onClick={handlePayment}
                  disabled={loading || selectedAddress === null}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>🚀</span>
                      <span>Proceed to Payment</span>
                    </div>
                  )}
                </button>

                {selectedAddress === null && addresses.length > 0 && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    Please select a delivery address
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
