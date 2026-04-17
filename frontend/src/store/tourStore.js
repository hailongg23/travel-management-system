import { create } from 'zustand';

const useTourStore = create((set, get) => ({
    tours: [],
    currentTour: null,
    isLoading: false,
    error: null,
    filters: {
        search: '',
        location: '',
        minPrice: 0,
        maxPrice: 0,
    },

    // Actions
    setTours: (tours) => set({ tours }),

    setCurrentTour: (tour) => set({ currentTour: tour }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),

    clearFilters: () => set({
        filters: {
            search: '',
            location: '',
            minPrice: 0,
            maxPrice: 0,
        }
    }),

    // Filter tours
    getFilteredTours: () => {
        const { tours, filters } = get();
        // Ensure tours is always an array
        const toursArray = Array.isArray(tours) ? tours : [];
        return toursArray.filter(tour => {
            const matchesSearch = !filters.search ||
                tour.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                tour.location.toLowerCase().includes(filters.search.toLowerCase());

            const matchesLocation = !filters.location ||
                tour.location.toLowerCase().includes(filters.location.toLowerCase());

            const matchesPrice = (!filters.minPrice || tour.price >= filters.minPrice) &&
                (!filters.maxPrice || tour.price <= filters.maxPrice);

            return matchesSearch && matchesLocation && matchesPrice;
        });
    },
}));

export default useTourStore;
