import axios from "axios";
import Cookies from "js-cookie";

const BASE = "http://localhost:3007/v1";

let _role: string | null = null;
let _token: string | null = null;
let _refreshing: Promise<string | null> | null = null;

export function setAuth(role: string | null, token: string | null) {
  _role = role;
  _token = token;
}

export function clearAuth() {
  _role = null;
  _token = null;
  localStorage.removeItem("userToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userData");
  localStorage.removeItem("refreshToken");
  Cookies.remove("refreshToken");
}

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  if (_role && _token) {
    config.headers.Authorization = `${_role} ${_token}`;
  }
  return config;
});

async function refreshToken(): Promise<string | null> {
  const refreshToken = Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
  if (!refreshToken || !_role) return null;

  try {
    const res = await axios.post(`${BASE}/auth/access-token`, null, {
      headers: { Authorization: `${_role} ${refreshToken}` },
    });
    const newToken = res.data?.data?.accessToken;
    if (newToken) {
      console.log("Token refreshed", { old: _token, new: newToken });
      _token = newToken;
      localStorage.setItem("userToken", newToken);
    }
    return newToken ?? null;
  } catch {
    console.log("Token refresh failed");
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (!_refreshing) {
      _refreshing = refreshToken();
    }

    const newToken = await _refreshing;
    _refreshing = null;

    if (newToken) {
      original.headers.Authorization = `${_role} ${newToken}`;
      return api(original);
    }

    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
