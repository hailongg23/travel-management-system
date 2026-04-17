import { useState, useEffect } from 'react';
import { bookingAPI } from '../services/bookingService';
import CancelBookingModal from '../components/CancelBookingModal';
import BookingDetailModal from '../components/BookingDetailModal';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        loadUserBookings();
    }, []);

    const loadUserBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingAPI.getUserBookings();
            setBookings(data);
        } catch (error) {
            console.error('Error loading user bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId, reason) => {
        try {
            const booking = bookings.find(b => b._id === bookingId);
            const userEmail = booking?.contactPerson?.email || 'your email';

            await bookingAPI.cancelBooking(bookingId, reason);

            // Show success message with email notification info
            alert(`✅ Booking cancelled successfully!\n\n📧 Cancellation confirmation email sent to: ${userEmail}\n\nCancellation reason: ${reason}\n\nYou will receive refund information via email within 24 hours.`);

            loadUserBookings(); // Reload bookings
        } catch (error) {
            console.error('Error canceling booking:', error);

            // Show specific error message
            const errorMessage = error.response?.data?.message || 'Unable to cancel booking. Please try again.';
            alert(`❌ Lỗi: ${errorMessage}`);
        }
    };

    const openCancelModal = (booking) => {
        setSelectedBooking(booking);
        setCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        setSelectedBooking(null);
        setCancelModalOpen(false);
    };

    const handleViewDetail = (booking) => {
        setSelectedBooking(booking);
        setDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setSelectedBooking(null);
        setDetailModalOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-500 text-white';
            case 'pending':
                return 'bg-amber-500 text-white';
            case 'cancelled':
                return 'bg-red-500 text-white';
            case 'completed':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatStatus = (status) => {
        const statusMap = {
            pending: 'Pending Confirmation',
            confirmed: 'Confirmed',
            cancelled: 'Cancelled',
            completed: 'Completed'
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải danh sách booking...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900"> My Booking</h1>
                    <p className="mt-2 text-gray-600">Manage and track all your bookings</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có booking nào</h3>
                        <p className="text-gray-500 mb-6">Bạn chưa có booking nào. Hãy khám phá các tour du lịch tuyệt vời của chúng tôi!</p>
                        <a href="/tours"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                            Xem các tour
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                        {booking.tourId?.title || 'Tour không xác định'}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {booking.tourId?.location}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            Khởi hành: {new Date(booking.departureDate).toLocaleDateString('vi-VN')}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {booking.numberOfTravelers} travelers
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                                        {formatStatus(booking.status)}
                                                    </span>
                                                    <span className="text-2xl font-bold text-blue-600 mt-2">
                                                        {formatPrice(booking.totalAmount)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Booking ID:</span> #{booking._id.slice(-8)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Ngày đặt:</span>{' '}
                                                        {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Contact Person:</span> {booking.contactPerson?.name}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Email:</span> {booking.contactPerson?.email}
                                                    </div>
                                                </div>

                                                {booking.status === 'cancelled' && booking.cancellationReason && (
                                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                                        <div className="flex items-start">
                                                            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                                            </svg>
                                                            <div>
                                                                <p className="text-sm font-medium text-red-800">Booking has been cancelled</p>
                                                                <p className="text-sm text-red-700 mt-1">
                                                                    <strong>Lý do:</strong> {booking.cancellationReason}
                                                                </p>
                                                                {booking.cancelledAt && (
                                                                    <p className="text-sm text-red-600 mt-1">
                                                                        <strong>Cancellation Date:</strong>{' '}
                                                                        <span>{new Date(booking.cancelledAt).toLocaleDateString('vi-VN', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}</span>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => handleViewDetail(booking)}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Details
                                        </button>

                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => openCancelModal(booking)}
                                                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Booking Modal */}
            <CancelBookingModal
                isOpen={cancelModalOpen}
                onClose={closeCancelModal}
                booking={selectedBooking}
                onCancel={handleCancelBooking}
            />

            {/* Booking Detail Modal */}
            <BookingDetailModal
                isOpen={detailModalOpen}
                onClose={closeDetailModal}
                booking={selectedBooking}
            />
        </div>
    );
};

export default MyBookings;
