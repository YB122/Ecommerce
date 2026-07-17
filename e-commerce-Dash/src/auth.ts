const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3007/v1';

const COOKIE_REFRESH_KEY = 'refresh_token';
const LS_REFRESH_KEY = 'refresh_token';
const LS_ACCESS_KEY = 'access_token';
const LS_ROLE_KEY = 'user_role';
const LS_USER_ID_KEY = 'user_id';
const LS_USER_NAME_KEY = 'full_name';
const LS_USER_EMAIL_KEY = 'email';

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const setCookie = (name: string, value: string, days: number) => {
  document.cookie = `${name}=${value}; path=/; max-age=${days * 86400}; SameSite=Strict`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
};

export const getAccessToken = (): string | null => localStorage.getItem(LS_ACCESS_KEY);
export const setAccessToken = (token: string) => localStorage.setItem(LS_ACCESS_KEY, token);

export const getRefreshToken = (): string | null => {
  const fromCookie = getCookie(COOKIE_REFRESH_KEY);
  if (fromCookie) return fromCookie;
  return localStorage.getItem(LS_REFRESH_KEY);
};
export const setRefreshToken = (token: string) => {
  setCookie(COOKIE_REFRESH_KEY, token, 365);
  localStorage.setItem(LS_REFRESH_KEY, token);
};

export const getRole = (): string | null => localStorage.getItem(LS_ROLE_KEY);
export const setRole = (role: string) => localStorage.setItem(LS_ROLE_KEY, role);

export const getUserId = (): string => localStorage.getItem(LS_USER_ID_KEY) || '';
export const setUserId = (id: string) => localStorage.setItem(LS_USER_ID_KEY, id);

export const getUserName = (): string => localStorage.getItem(LS_USER_NAME_KEY) || '';
export const setUserName = (name: string) => localStorage.setItem(LS_USER_NAME_KEY, name);

export const getUserEmail = (): string => localStorage.getItem(LS_USER_EMAIL_KEY) || '';
export const setUserEmail = (email: string) => localStorage.setItem(LS_USER_EMAIL_KEY, email);

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  const role = getRole();
  if (token && role) return { Authorization: `${role} ${token}` };
  return {} as Record<string, string>;
};

export const clearAuth = () => {
  localStorage.removeItem(LS_ACCESS_KEY);
  localStorage.removeItem(LS_ROLE_KEY);
  localStorage.removeItem(LS_USER_ID_KEY);
  localStorage.removeItem(LS_USER_NAME_KEY);
  localStorage.removeItem(LS_USER_EMAIL_KEY);
  localStorage.removeItem(LS_REFRESH_KEY);
  removeCookie(COOKIE_REFRESH_KEY);
};

export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  const role = getRole();
  if (!refreshToken || !role) return false;

  try {
    const res = await fetch(`${API_URL}/auth/access-token`, {
      method: 'POST',
      headers: { Authorization: `${role} ${refreshToken}` },
    });
    if (!res.ok) return false;
    const json = await res.json();
    const newAccessToken = json.data?.accessToken;
    if (newAccessToken) {
      setAccessToken(newAccessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const fetchWithRefresh = async (url: string, options?: RequestInit): Promise<Response> => {
  let res = await fetch(url, options);
  if (res.status !== 401) return res;

  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshAccessToken().then(success => {
      isRefreshing = false;
      refreshPromise = null;
      return success;
    });
  }

  const refreshed = await refreshPromise;
  if (!refreshed) return res;

  const newHeaders = { ...options?.headers, ...getAuthHeaders() };
  res = await fetch(url, { ...options, headers: newHeaders });
  return res;
};
