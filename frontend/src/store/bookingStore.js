import { create } from 'zustand';

const useBookingStore = create((set, get) => ({
    bookings: [],
    userBookings: [],
    isLoading: false,
    error: null,

    // Actions
    setBookings: (bookings) => set({ bookings }),

    setUserBookings: (userBookings) => set({ userBookings }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    addBooking: (booking) => set((state) => ({
        userBookings: [...state.userBookings, booking],
        bookings: [...state.bookings, booking]
    })),

    updateBookingStatus: (bookingId, status) => set((state) => ({
        bookings: state.bookings.map(booking =>
            booking._id === bookingId ? { ...booking, status } : booking
        ),
        userBookings: state.userBookings.map(booking =>
            booking._id === bookingId ? { ...booking, status } : booking
        )
    })),

    // Getters
    getBookingsByStatus: (status) => {
        const { bookings } = get();
        return bookings.filter(booking => booking.status === status);
    },
}));

export default useBookingStore;
