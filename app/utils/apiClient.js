const DEFAULT_BASE_URL = 'https://e-commerce-backend-d25l.onrender.com';

const isAbsoluteUrl = (url) => /^https?:\/\//i.test(url);

const ensureBaseUrl = (url) => {
  if (!url) return DEFAULT_BASE_URL;
  if (isAbsoluteUrl(url)) return url;
  return `${DEFAULT_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('authToken');
  } catch {
    return null;
  }
};

export const setStoredToken = (token) => {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  } catch {
    // ignore storage errors (private mode, etc.)
  }
};

export const clearStoredToken = () => setStoredToken(null);

export const apiFetch = (input, options = {}) => {
  const { skipAuth = false, token: overrideToken, ...rest } = options;
  const finalUrl = ensureBaseUrl(
    typeof input === 'string' ? input : `${input}`
  );

  const headers = new Headers(rest.headers || {});
  const effectiveToken = skipAuth ? null : overrideToken ?? getStoredToken();
  if (effectiveToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${effectiveToken}`);
  }

  return fetch(finalUrl, {
    ...rest,
    headers,
    credentials: 'include',
  });
};
