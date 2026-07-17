import { AuthProvider } from 'react-admin';
import {
  setAccessToken,
  setRefreshToken,
  setRole,
  setUserId,
  setUserName,
  setUserEmail,
  clearAuth,
  refreshAccessToken,
} from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3007/v1';

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(err.message);
    }

    const json = await res.json();
    const { accessToken, refreshToken, role, user } = json.data;

    if (!['admin', 'superAdmin'].includes(role)) {
      throw new Error('Access denied. Admin privileges required.');
    }

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setRole(role);
    setUserId(user?._id || '');
    setUserName(user?.name || '');
    setUserEmail(user?.email || '');

    return Promise.resolve();
  },

  logout: () => {
    clearAuth();
    return Promise.resolve();
  },

  checkError: async ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      const refreshed = await refreshAccessToken();
      if (refreshed) return Promise.resolve();
      clearAuth();
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    return token && role ? Promise.resolve() : Promise.reject();
  },

  getPermissions: () => {
    const role = localStorage.getItem('user_role') || '';
    return Promise.resolve(role);
  },

  getIdentity: () => {
    const fullName = localStorage.getItem('full_name') || 'Admin';
    const email = localStorage.getItem('email') || '';
    const userId = localStorage.getItem('user_id') || '';
    return Promise.resolve({
      id: userId,
      fullName,
      email,
      avatar: undefined,
    });
  },
};

export default authProvider;
