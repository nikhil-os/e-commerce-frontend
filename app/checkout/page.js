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

  return (
    <Layout>
      {/* Existing Addresses */}
      {addresses.length > 0 && (
        <div id="existing-address-section" className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Address</h3>
          {addresses.map((addr, i) => (
            <label key={i} className="block mb-2">
              <input
                type="radio"
                name="selectedAddress"
                value={i}
                checked={selectedAddress === i}
                onChange={() => setSelectedAddress(i)}
              />
              {addr.fullName}, {addr.street}, {addr.city}, {addr.state},{" "}
              {addr.zip}
            </label>
          ))}
        </div>
      )}
      {/* New Address Form */}
      <form
        onSubmit={handleFormSubmit}
        className="mt-8 bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
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
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.country}
              onChange={handleFormChange}
            />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            name="isDefault"
            id="isDefault"
            className="mr-2"
            checked={form.isDefault}
            onChange={handleFormChange}
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">
            Make this my default address
          </label>
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            💾 Save Address
          </button>
        </div>
      </form>
      {/* Bill Summary Section */}
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">🧾 Bill Summary</h2>
        {cartItems.map((item, idx) => (
          <div key={idx} className="flex justify-between mb-2">
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p>₹{item.product.price * item.quantity}</p>
          </div>
        ))}
        <hr className="my-3" />
        <p className="text-md">Subtotal: ₹{total}</p>
        <p className="text-md">Delivery Fee: ₹50</p>
        <p className="text-lg font-bold mt-2">Total: ₹{total + 50}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          type="button"
          onClick={handlePayment}
        >
          Confirm Payment
        </button>
      </div>
    </Layout>
  );
}
