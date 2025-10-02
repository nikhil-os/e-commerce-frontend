"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

// Create context with default values
const AuthContext = createContext({
  user: null,
  loading: true,
  cartItems: [],
  cartCount: 0,
  login: () => {},
  logout: () => {},
  updateCart: () => {},
  refreshCart: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Helper function to save user to localStorage
  const saveUserToStorage = (userData) => {
    if (typeof window !== "undefined" && userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // Helper function to load user from localStorage
  const loadUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  };

  // Helper function to remove user from localStorage
  const removeUserFromStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('user');
    }
  };

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = loadUserFromStorage();
    if (savedUser) {
      setUser(savedUser);
    }
    
    // Also initialize cart data from localStorage
    const savedCartItems = localStorage.getItem('cartItems');
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
    if (savedCartCount) {
      setCartCount(parseInt(savedCartCount));
    }
  }, []);

  // Fetch user profile on initial load with debouncing
  useEffect(() => {
    let isMounted = true;

    // Skip during SSR/SSG build process
    if (typeof window === "undefined") {
      return;
    }

    // Skip if no API URL is available (build time)
    if (!process.env.NEXT_PUBLIC_API_URL) {
      if (isMounted) setLoading(false);
      return;
    }

    // Skip if we're in an HMR refresh to reduce backend spam
    if (window.__next_hmr_refresh_hash__) {
      if (isMounted) setLoading(false);
      return;
    }

    // Debounce the fetch to prevent multiple rapid calls
    const timeoutId = setTimeout(async () => {
      if (!isMounted) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
          {
            credentials: "include",
          }
        );

        if (res.ok && isMounted) {
          const data = await res.json();
          setUser(data.user);
          saveUserToStorage(data.user);
          // Fetch cart data after authentication is confirmed
          await fetchCartData();
        } else if (isMounted) {
          // If API call fails, keep the user from localStorage but still set loading to false
          const savedUser = loadUserFromStorage();
          if (!savedUser) {
            setUser(null);
            removeUserFromStorage();
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 100); // 100ms debounce

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Function to fetch cart data
  const fetchCartData = async () => {
    // Skip during SSR/SSG
    if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_API_URL) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
        const count = data.items
          ? data.items.reduce((sum, item) => sum + item.quantity, 0)
          : 0;
        setCartCount(count);
        
        // Save cart data to localStorage as backup
        if (typeof window !== "undefined") {
          localStorage.setItem('cartItems', JSON.stringify(data.items || []));
          localStorage.setItem('cartCount', count.toString());
        }
      } else {
        // If API fails, try to load from localStorage
        if (typeof window !== "undefined") {
          const savedCartItems = localStorage.getItem('cartItems');
          const savedCartCount = localStorage.getItem('cartCount');
          if (savedCartItems) {
            setCartItems(JSON.parse(savedCartItems));
          }
          if (savedCartCount) {
            setCartCount(parseInt(savedCartCount));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // If API fails, try to load from localStorage
      if (typeof window !== "undefined") {
        const savedCartItems = localStorage.getItem('cartItems');
        const savedCartCount = localStorage.getItem('cartCount');
        if (savedCartItems) {
          setCartItems(JSON.parse(savedCartItems));
        }
        if (savedCartCount) {
          setCartCount(parseInt(savedCartCount));
        }
      }
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      // Set user from login response if available
      if (data.user) {
        setUser(data.user);
        saveUserToStorage(data.user);
      }
      // Try to fetch user profile for freshest data
      try {
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
          {
            credentials: "include",
          }
        );
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
          saveUserToStorage(userData.user);
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
      removeUserFromStorage();
      // Clear cart data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartCount');
      }
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Add to cart function
  const addToCart = async (productId, quantity = 1) => {
    try {
      console.log("addToCart payload:", { productId, quantity });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, quantity }),
          credentials: "include",
        }
      );
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
