import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.hailong.online/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token refresh function
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem('auth-storage') ?
            JSON.parse(localStorage.getItem('auth-storage')).state : null;

        if (authData?.tokens?.accessToken) {
            config.headers.Authorization = `Bearer ${authData.tokens.accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return api(original);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            original._retry = true;
            isRefreshing = true;

            const authData = localStorage.getItem('auth-storage') ?
                JSON.parse(localStorage.getItem('auth-storage')).state : null;

            if (authData?.tokens?.refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken: authData.tokens.refreshToken
                    });

                    const { tokens } = response.data;

                    // Update stored tokens
                    const updatedAuthData = {
                        ...authData,
                        tokens
                    };
                    localStorage.setItem('auth-storage', JSON.stringify({
                        state: updatedAuthData
                    }));

                    // Update default header
                    api.defaults.headers.Authorization = `Bearer ${tokens.accessToken}`;
                    original.headers.Authorization = `Bearer ${tokens.accessToken}`;

                    processQueue(null, tokens.accessToken);
                    isRefreshing = false;

                    return api(original);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;

                    // Try to logout from server before clearing local data
                    try {
                        await api.post('/auth/logout');
                    } catch (logoutError) {
                        // Ignore logout errors during token refresh failure
                    }

                    // Clear auth data and redirect to login
                    localStorage.removeItem('auth-storage');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token, try to logout from server
                try {
                    await api.post('/auth/logout');
                } catch (logoutError) {
                    // Ignore logout errors when no refresh token
                }

                // Clear local auth data and redirect to login
                localStorage.removeItem('auth-storage');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
