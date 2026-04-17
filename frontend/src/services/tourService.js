import api from './api';

export const tourAPI = {
    // Get all tours with optional filters
    getTours: async (params = {}) => {
        const response = await api.get('/tours', { params });
        return response.data;
    },

    // Get tour by ID
    getTourById: async (id) => {
        const response = await api.get(`/tours/${id}`);
        return response.data;
    },

    // Create new tour (Admin only)
    createTour: async (tourData) => {
        const response = await api.post('/tours', tourData);
        return response.data;
    },

    // Update tour (Admin only)
    updateTour: async (id, tourData) => {
        const response = await api.put(`/tours/${id}`, tourData);
        return response.data;
    },

    // Delete tour (Admin only)
    deleteTour: async (id) => {
        const response = await api.delete(`/tours/${id}`);
        return response.data;
    },

    // Upload tour images
    uploadImages: async (id, formData) => {
        const response = await api.post(`/tours/${id}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Toggle tour active status (Admin only)
    toggleActive: async (id) => {
        const response = await api.put(`/tours/${id}/toggle-active`);
        return response.data;
    },

    // Update tour images (Admin only)
    updateImages: async (id, images) => {
        const response = await api.post(`/tours/${id}/images`, { images });
        return response.data;
    },
};

export default tourAPI;
