import api from './api';

export const authAPI = {
    // Register user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    // Refresh token
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    // Logout current session
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Logout all sessions
    logoutAll: async () => {
        const response = await api.post('/auth/logout-all');
        return response.data;
    },

    // Get user sessions
    getSessions: async () => {
        const response = await api.get('/auth/sessions');
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', {
            token,
            newPassword
        });
        return response.data;
    },

    // Validate reset token
    validateResetToken: async (token) => {
        const response = await api.get(`/auth/validate-reset-token?token=${token}`);
        return response.data;
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await api.put('/auth/change-password', passwordData);
        return response.data;
    },

    // Update security settings
    updateSecuritySettings: async (settings) => {
        const response = await api.put('/auth/security-settings', settings);
        return response.data;
    },

    // Delete user account
    deleteAccount: async (passwordData) => {
        const response = await api.delete('/auth/account', { data: passwordData });
        return response.data;
    },

    // Terminate specific session
    terminateSession: async (sessionId) => {
        const response = await api.delete(`/auth/sessions/${sessionId}`);
        return response.data;
    },
};

export default authAPI;
