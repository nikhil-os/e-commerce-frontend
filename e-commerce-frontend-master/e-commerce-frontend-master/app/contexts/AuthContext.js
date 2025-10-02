"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Fetch user profile on initial load with debouncing
  useEffect(() => {
    // Skip if we're in an HMR refresh to reduce backend spam
    if (typeof window !== "undefined" && window.__next_hmr_refresh_hash__) {
      setLoading(false);
      return;
    }

    // Debounce the fetch to prevent multiple rapid calls
    const timeoutId = setTimeout(async () => {
      try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          // Fetch cart data after authentication is confirmed
          fetchCartData();
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, []);

  // Function to fetch cart data
  const fetchCartData = async () => {
    try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        setCartCount(
          data.items
            ? data.items.reduce((sum, item) => sum + item.quantity, 0)
            : 0
        );
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      // Set user from login response if available
      if (data.user) {
        setUser(data.user);
      }
      // Try to fetch user profile for freshest data
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          credentials: "include",
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }
      } catch (e) {
        // Ignore profile fetch error, user already set
      }
      // Fetch cart data after login
      fetchCartData();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      setCartItems([]);
      setCartCount(0);
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Add to cart function
  const addToCart = async (productId, quantity = 1) => {
    try {
      console.log('addToCart payload:', { productId, quantity });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add item to cart");
      }
      // Refresh cart data
      await fetchCartData();
      return { success: true, message: "Item added to cart" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/update/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
          credentials: "include",
        }
      );

      // Handle possible non-JSON responses with better error logging
      let data;
      const contentType = response.headers.get("content-type");
      console.log("Response status:", response.status);
      console.log("Content-Type:", contentType);

      let responseText = "";
      try {
        // Try to get the response text first
        responseText = await response.text();
        console.log("Update response text:", responseText);

        // Try to parse as JSON if not empty
        if (responseText.trim()) {
          data = JSON.parse(responseText);
          console.log("Update response data:", data);
        } else {
          console.log("Empty response received");
          data = { success: true, message: "Operation successful" };
        }
      } catch (parseError) {
        console.error("Error parsing JSON in updateCartItem:", parseError);
        data = {
          success: response.ok, // Consider it successful if the status is 200-299
          message: response.ok
            ? "Operation successful"
            : "Unexpected response format",
        };
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to update cart");
      }

      // Refresh cart data from server instead of updating local state
      await fetchCartData();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove/${productId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      // Handle possible non-JSON responses with better error logging
      let data;
      const contentType = response.headers.get("content-type");
      console.log("Remove response status:", response.status);
      console.log("Remove Content-Type:", contentType);

      let responseText = "";
      try {
        // Try to get the response text first
        responseText = await response.text();
        console.log("Remove response text:", responseText);

        // Try to parse as JSON if not empty
        if (responseText.trim()) {
          data = JSON.parse(responseText);
          console.log("Remove response data:", data);
        } else {
          console.log("Empty response received");
          data = { success: true, message: "Operation successful" };
        }
      } catch (parseError) {
        console.error("Error parsing JSON in removeFromCart:", parseError);
        data = {
          success: response.ok, // Consider it successful if the status is 200-299
          message: response.ok
            ? "Operation successful"
            : "Unexpected response format",
        };
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove item from cart");
      }

      // Refresh cart data from server instead of updating local state
      await fetchCartData();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        cartItems,
        cartCount,
        addToCart,
        updateCartItem,
        removeFromCart,
        fetchCartData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
