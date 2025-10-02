"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useRouter } from "next/navigation";
import LocationPicker from "../components/LocationPicker";

export default function CheckoutPage() {
  const { user, cartItems } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [location, setLocation] = useState(null);
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
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout/addresses`, {
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
      const addressData = {
        ...form,
        location: location
          ? {
              address:
                location.address?.formatted || location.fullAddress || "",
              coordinates: location.coordinates
                ? {
                    latitude:
                      location.coordinates.lat || location.coordinates.latitude,
                    longitude:
                      location.coordinates.lng ||
                      location.coordinates.longitude,
                  }
                : null,
              city: location.address?.city || location.city || "",
              state: location.address?.state || location.state || "",
              country: location.address?.country || location.country || "",
              zipCode:
                location.address?.zip || location.zipCode || location.zip || "",
            }
          : null,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAddresses([...addresses, data.address]);
        setSelectedAddress(addresses.length);
        setForm({
          fullName: "",
          mobile: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          isDefault: false,
        });
        setLocation(null);
        toast.success("📍 Address saved successfully!");
      } else {
        toast.error(data.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
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
      toast.warning("⚠️ Please select an address for delivery");
      return;
    }

    setLoading(true);

    try {
      const orderTotal =
        cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ) + 50;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressId: addresses[selectedAddress]._id,
            total: orderTotal,
          }),
          credentials: "include",
        }
      );

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
          if (data.order && data.order.id) {
            window.location.href = `/payment?orderId=${data.order.id}`;
          } else {
            console.error("Invalid order data:", data);
            toast.error("Invalid order data received from server");
          }
        } else {
          toast.error(data.message || "Failed to create order");
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        toast.error("Unexpected response format. Check console for details.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] flex items-center justify-center">
          <div className="w-full max-w-md p-8 mx-4 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d] mx-auto mb-4"></div>
              <p className="text-lg text-white">Loading checkout...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] flex items-center justify-center">
          <div className="w-full max-w-md p-8 mx-4 text-center border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl">
            <div className="mb-4 text-6xl text-red-400">⚠️</div>
            <h2 className="mb-4 text-2xl font-bold text-white">Error</h2>
            <p className="mb-6 text-gray-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white px-6 py-3 rounded-xl hover:from-[#ff5588] hover:to-[#ff9fcc] transition-all duration-300 font-medium"
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
      <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] relative overflow-hidden">
        {/* Cosmic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#ff6b9d] opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-[#ffb3d9] opacity-10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-[#ff91ba] opacity-10 blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Main Content */}
        <div className="container relative z-10 px-4 py-8 mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] bg-clip-text text-transparent mb-3">
              Secure Checkout
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-300">
              Complete your cosmic shopping journey with our secure checkout
              process
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid gap-8 mx-auto lg:grid-cols-12 max-w-7xl">
            {/* Left Column - Address & Forms */}
            <div className="space-y-8 lg:col-span-8">
              {/* Existing Addresses Section */}
              {addresses.length > 0 && (
                <div className="p-8 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-white">📍</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Delivery Address
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {addresses.map((addr, i) => (
                      <label key={i} className="block cursor-pointer group">
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={i}
                          checked={selectedAddress === i}
                          onChange={() => setSelectedAddress(i)}
                          className="sr-only"
                        />
                        <div
                          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                            selectedAddress === i
                              ? "border-[#ff6b9d] bg-gradient-to-r from-[#ff6b9d]/20 to-[#ffb3d9]/20 shadow-lg transform scale-[1.02]"
                              : "border-white/20 bg-white/5 hover:border-[#ff6b9d]/50 hover:bg-white/10 group-hover:scale-[1.01]"
                          }`}
                        >
                          {/* Selection Indicator */}
                          <div className="absolute top-4 right-4">
                            <div
                              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                                selectedAddress === i
                                  ? "border-[#ff6b9d] bg-[#ff6b9d]"
                                  : "border-white/40"
                              }`}
                            >
                              {selectedAddress === i && (
                                <div className="w-full h-full rounded-full bg-white scale-[0.4] transition-transform duration-300"></div>
                              )}
                            </div>
                          </div>

                          {/* Address Content */}
                          <div className="pr-10">
                            <h4 className="mb-2 text-xl font-bold text-white">
                              {addr.fullName}
                            </h4>
                            <p className="mb-2 leading-relaxed text-gray-300">
                              {addr.street}, {addr.city}, {addr.state}{" "}
                              {addr.zip}
                            </p>
                            <div className="flex items-center text-sm text-gray-400">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              {addr.mobile}
                            </div>
                            {addr.isDefault && (
                              <span className="inline-block mt-3 bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white text-xs px-3 py-1 rounded-full font-medium">
                                ✨ Default Address
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Address Form */}
              <div className="p-8 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-white">📬</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Add New Address
                  </h2>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Location Picker Section */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-[#ff6b9d]/10 to-[#ffb3d9]/10 border border-white/10">
                    <label className="block mb-3 text-lg font-medium text-white">
                      📍 Smart Location Detection
                    </label>
                    <LocationPicker
                      onLocationChange={(selectedLocation) => {
                        setLocation(selectedLocation);
                        // Auto-fill form fields when location is selected
                        if (selectedLocation) {
                          setForm((prev) => ({
                            ...prev,
                            street:
                              selectedLocation.address?.street ||
                              selectedLocation.fullAddress ||
                              prev.street,
                            city:
                              selectedLocation.address?.city ||
                              selectedLocation.city ||
                              prev.city,
                            state:
                              selectedLocation.address?.state ||
                              selectedLocation.state ||
                              prev.state,
                            zip:
                              selectedLocation.address?.zip ||
                              selectedLocation.zipCode ||
                              prev.zip,
                            country:
                              selectedLocation.address?.country ||
                              selectedLocation.country ||
                              prev.country,
                          }));
                        }
                      }}
                      initialLocation={location}
                    />
                    {location && (
                      <div className="p-3 mt-4 border bg-white/10 rounded-xl border-white/20">
                        <p className="text-sm text-gray-300">
                          <span className="text-[#ff6b9d] font-medium">
                            Auto-detected:
                          </span>{" "}
                          {location.address?.formatted ||
                            location.fullAddress ||
                            "Location detected"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Manual Form Fields */}
                  <div className="space-y-4">
                    <div className="pb-2 mb-4 text-lg font-medium text-white border-b border-white/20">
                      Manual Address Details
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Enter your full name"
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all duration-300"
                          value={form.fullName}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          placeholder="Enter mobile number"
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all duration-300"
                          value={form.mobile}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        placeholder="House/Flat No., Building, Street"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all duration-300"
                        value={form.street}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          placeholder="Enter city"
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all duration-300"
                          value={form.city}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          placeholder="Enter state"
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all duration-300"
                          value={form.state}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zip"
                          placeholder="Enter ZIP"
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all duration-300"
                          value={form.zip}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        placeholder="Enter country"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition-all duration-300"
                        value={form.country}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isDefault"
                        id="isDefault"
                        className="w-5 h-5 bg-white/10 border-2 border-white/20 rounded text-[#ff6b9d] focus:ring-[#ff6b9d] focus:ring-offset-0"
                        checked={form.isDefault}
                        onChange={handleFormChange}
                      />
                      <label htmlFor="isDefault" className="ml-3 text-gray-300">
                        Set as default address
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white font-bold rounded-xl hover:from-[#ff5588] hover:to-[#ff9fcc] focus:outline-none focus:ring-4 focus:ring-[#ff6b9d]/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                        Saving Address...
                      </div>
                    ) : (
                      "💾 Save Address"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-8">
                <div className="p-8 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-white">🛍️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Order Summary
                    </h3>
                  </div>

                  {/* Cart Items */}
                  <div className="mb-6 space-y-4">
                    {cartItems && cartItems.length > 0 ? (
                      cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center p-4 border bg-white/5 rounded-xl border-white/10"
                        >
                          <img
                            src={
                              item.product.image || "/placeholder-product.jpg"
                            }
                            alt={item.product.name}
                            className="object-cover w-16 h-16 mr-4 rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white line-clamp-2">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="font-bold text-white">
                            ₹
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <div className="mb-2 text-4xl">🛒</div>
                        <p className="text-gray-400">Your cart is empty</p>
                      </div>
                    )}
                  </div>

                  {/* Order Totals */}
                  <div className="pt-4 space-y-3 border-t border-white/20">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery</span>
                      <span>₹50</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax</span>
                      <span>₹{Math.round(total * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="pt-3 border-t border-white/20">
                      <div className="flex justify-between text-xl font-bold text-white">
                        <span>Total</span>
                        <span className="text-[#ff6b9d]">
                          ₹
                          {(
                            total +
                            50 +
                            Math.round(total * 0.18)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handlePayment}
                    disabled={selectedAddress === null || loading}
                    className="w-full mt-8 py-4 bg-gradient-to-r from-[#ff6b9d] to-[#ffa500] text-white font-bold rounded-xl hover:from-[#ff5588] hover:to-[#ff9500] focus:outline-none focus:ring-4 focus:ring-[#ff6b9d]/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🚀</span>
                        Proceed to Payment
                      </div>
                    )}
                  </button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center mt-6 text-sm text-gray-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Secured by 256-bit SSL encryption
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
