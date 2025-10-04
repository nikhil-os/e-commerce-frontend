'use client';
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null); // optional bearer token fallback
  const tokenRestoredRef = useRef(false);
  const TOKEN_KEY = 'authToken';
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  const readStoredToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }, []);

  const buildAuthHeaders = useCallback(
    (tokenOverride) => {
      const token = tokenOverride ?? authToken ?? readStoredToken();
      return token ? { Authorization: `Bearer ${token}` } : undefined;
    },
    [authToken, readStoredToken]
  );

  // Function to fetch cart data
  const fetchCartData = useCallback(
    async (tokenOverride) => {
      try {
        const headers = buildAuthHeaders(tokenOverride);
        const res = await fetch(
          'https://e-commerce-backend-1-if2s.onrender.com/api/cart',
          {
            credentials: 'include',
            ...(headers ? { headers } : {}),
          }
        );

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
        console.error('Error fetching cart:', error);
      }
    },
    [buildAuthHeaders]
  );

  // Fetch user profile on initial load with debouncing
  // 1. Restore token from localStorage (runs once on mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        setAuthToken(stored);
        tokenRestoredRef.current = true;
      } else {
        tokenRestoredRef.current = true; // nothing to restore
      }
    }
  }, []);

  // 2. Fetch profile after token restoration OR when authToken changes (and user not yet loaded)
  useEffect(() => {
    if (!tokenRestoredRef.current) return; // wait until token restoration attempt done
    if (user) return; // already have user
    // Skip if we're in an HMR refresh to reduce backend spam
    if (typeof window !== 'undefined' && window.__next_hmr_refresh_hash__) {
      setLoading(false);
      return;
    }

    // Debounce the fetch to prevent multiple rapid calls
    const timeoutId = setTimeout(async () => {
      try {
        const headers = buildAuthHeaders();
        const res = await fetch(
          'https://e-commerce-backend-1-if2s.onrender.com/api/users/profile',
          {
            credentials: 'include',
            ...(headers ? { headers } : {}),
          }
        );
        if (!res.ok) {
          console.debug('[Auth] Profile fetch not ok:', res.status);
        } else {
          let data = {};
          try {
            data = await res.json();
          } catch (e) {
            console.warn('[Auth] Failed parsing profile JSON', e);
          }
          if (data?.user) {
            setUser(data.user);
            fetchCartData();
          } else {
            console.debug('[Auth] Profile response missing user field', data);
          }
        }
      } catch (error) {
        console.error('[Auth] Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [authToken, user, buildAuthHeaders, fetchCartData]);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await fetch(
        'https://e-commerce-backend-1-if2s.onrender.com/api/users/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
          credentials: 'include',
        }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        console.debug('[Auth] Login failed status=', response.status, data);
        return { success: false, message: data.message || 'Login failed' };
      }

      const normalizeHeaderToken = (raw) => {
        if (typeof raw !== 'string') return null;
        const trimmed = raw.trim();
        if (!trimmed) return null;
        return trimmed.startsWith('Bearer ')
          ? trimmed.slice(7).trim()
          : trimmed;
      };

      const pickToken = (...candidates) =>
        candidates.find((value) => typeof value === 'string' && value.trim().length > 0) || null;

      const headerAuth =
        response.headers.get('authorization') ||
        response.headers.get('Authorization');
      const headerBearer = normalizeHeaderToken(headerAuth);
      const headerToken = normalizeHeaderToken(response.headers.get('x-auth-token'));

      // If backend already returns user, optimistically set it so UI updates immediately
      // Capture token (if backend uses token-based auth instead of / in addition to cookies)
      const possibleToken = pickToken(
        data?.token,
        data?.accessToken,
        data?.jwt,
        data?.data?.token,
        data?.data?.accessToken,
        data?.session?.token,
        data?.user?.token,
        headerBearer,
        headerToken
      );

      if (possibleToken) {
        setAuthToken(possibleToken);
        try {
          if (typeof window !== 'undefined')
            localStorage.setItem(TOKEN_KEY, possibleToken);
        } catch {}
      }

      const sessionToken = possibleToken || readStoredToken();

      if (data?.user) {
        setUser(data.user);
      } else {
        // Fallback provisional user (will be replaced by profile fetch)
        setUser((prev) => prev || { email: credentials.email });
      }
      // Attempt to fetch user profile (retry up to 2 times if it fails – cookies may not be available immediately)
      const attemptProfileFetch = async () => {
        const headers = buildAuthHeaders(sessionToken);
        const res = await fetch(
          'https://e-commerce-backend-1-if2s.onrender.com/api/users/profile',
          {
            credentials: 'include',
            ...(headers ? { headers } : {}),
          }
        );
        if (!res.ok) {
          throw new Error('profile_fetch_status_' + res.status);
        }
        let payload = {};
        try {
          payload = await res.json();
        } catch {
          throw new Error('profile_json_parse_error');
        }
        if (!payload.user) throw new Error('profile_missing_user_field');
        return payload.user;
      };

      let profileUser = null;
      for (let i = 0; i < 2; i++) {
        try {
          profileUser = await attemptProfileFetch();
          break;
        } catch (e) {
          console.debug(
            `[Auth] Profile fetch attempt ${i + 1} failed:`,
            e.message
          );
          // small delay before retry (200ms)
          await new Promise((r) => setTimeout(r, 200));
        }
      }

      if (profileUser) {
        setUser(profileUser);
        await fetchCartData(sessionToken);
        return { success: true, profileLoaded: true };
      } else {
        console.warn(
          '[Auth] Login succeeded but profile could not be loaded after retries. Proceeding with provisional user.'
        );
        return {
          success: true,
          profileLoaded: false,
          message: 'Profile not loaded yet',
        };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const headers = buildAuthHeaders();
      await fetch(
        'https://e-commerce-backend-1-if2s.onrender.com/api/users/logout',
        {
          method: 'POST',
          credentials: 'include',
          ...(headers ? { headers } : {}),
        }
      );

      setUser(null);
      setAuthToken(null);
      try {
        if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
      } catch {}
      setCartItems([]);
      setCartCount(0);
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Add to cart function
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      router.push('/users/login');
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      console.log('Adding to cart:', productId, quantity);
      // Ensure productId is a valid MongoDB ObjectId (24 character hex string)
      if (
        !productId ||
        typeof productId !== 'string' ||
        !/^[0-9a-fA-F]{24}$/.test(productId)
      ) {
        return { success: false, message: 'Invalid product ID format' };
      }

      // Log the token cookie before making the request
      console.log('Cookies before fetch:', document.cookie);

      const authHeaders = buildAuthHeaders();
      const response = await fetch(
        'https://e-commerce-backend-1-if2s.onrender.com/api/cart',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authHeaders || {}),
          },
          body: JSON.stringify({ productId, quantity }),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart');
      }

      // Refresh cart data
      await fetchCartData();
      return { success: true, message: 'Item added to cart' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      const authHeaders = buildAuthHeaders();
      const response = await fetch(
        `https://e-commerce-backend-1-if2s.onrender.com/api/cart/update/${productId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authHeaders || {}),
          },
          body: JSON.stringify({ quantity }),
          credentials: 'include',
        }
      );

      // Handle possible non-JSON responses with better error logging
      let data;
      const contentType = response.headers.get('content-type');
      console.log('Response status:', response.status);
      console.log('Content-Type:', contentType);

      let responseText = '';
      try {
        // Try to get the response text first
        responseText = await response.text();
        console.log('Update response text:', responseText);

        // Try to parse as JSON if not empty
        if (responseText.trim()) {
          data = JSON.parse(responseText);
          console.log('Update response data:', data);
        } else {
          console.log('Empty response received');
          data = { success: true, message: 'Operation successful' };
        }
      } catch (parseError) {
        console.error('Error parsing JSON in updateCartItem:', parseError);
        data = {
          success: response.ok, // Consider it successful if the status is 200-299
          message: response.ok
            ? 'Operation successful'
            : 'Unexpected response format',
        };
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart');
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
      const headers = buildAuthHeaders();
      const response = await fetch(
        `https://e-commerce-backend-1-if2s.onrender.com/api/cart/remove/${productId}`,
        {
          method: 'POST',
          credentials: 'include',
          ...(headers ? { headers } : {}),
        }
      );

      // Handle possible non-JSON responses with better error logging
      let data;
      const contentType = response.headers.get('content-type');
      console.log('Remove response status:', response.status);
      console.log('Remove Content-Type:', contentType);

      let responseText = '';
      try {
        // Try to get the response text first
        responseText = await response.text();
        console.log('Remove response text:', responseText);

        // Try to parse as JSON if not empty
        if (responseText.trim()) {
          data = JSON.parse(responseText);
          console.log('Remove response data:', data);
        } else {
          console.log('Empty response received');
          data = { success: true, message: 'Operation successful' };
        }
      } catch (parseError) {
        console.error('Error parsing JSON in removeFromCart:', parseError);
        data = {
          success: response.ok, // Consider it successful if the status is 200-299
          message: response.ok
            ? 'Operation successful'
            : 'Unexpected response format',
        };
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item from cart');
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
        authToken,
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
