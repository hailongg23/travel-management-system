import api from './api';

export const bookingAPI = {
    // Create new booking
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // Get user's bookings
    getUserBookings: async () => {
        const response = await api.get('/bookings/my-bookings');
        return response.data;
    },

    // Get all bookings (Admin only)
    getAllBookings: async (params = {}) => {
        const response = await api.get('/bookings', { params });
        return response.data;
    },

    // Get booking by ID
    getBookingById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    // Update booking status (Admin only)
    updateBookingStatus: async (id, status) => {
        const response = await api.put(`/bookings/${id}/status`, { status });
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (id, reason = '') => {
        const response = await api.put(`/bookings/${id}/cancel`, { reason });
        return response.data;
    },

    // Get booking statistics (Admin only)
    getBookingStats: async () => {
        const response = await api.get('/bookings/stats');
        return response.data;
    },

    // Admin cancel booking
    adminCancelBooking: async (id, adminNotes) => {
        const response = await api.put(`/bookings/${id}/admin-cancel`, { adminNotes });
        return response.data;
    },
};

export default bookingAPI;
