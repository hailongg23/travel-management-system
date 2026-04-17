import { useState, useEffect } from 'react';
import useBookingStore from '../../store/bookingStore';
import { bookingAPI } from '../../services/bookingService';

const BookingManager = () => {
    const { bookings, setBookings, setLoading, isLoading } = useBookingStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingAPI.getAllBookings();
            setBookings(data);
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const booking = bookings.find(b => b._id === bookingId);
            const userEmail = booking?.contactPerson?.email || 'customer email';

            await bookingAPI.updateBookingStatus(bookingId, newStatus);

            // Show success message with email notification info
            alert(`✅ Booking status updated successfully!\n\n📧 An email notification has been sent to: ${userEmail}\n\nNew Status: ${newStatus.toUpperCase()}`);

            await loadBookings(); // Reload bookings
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update booking status. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Management</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                        <div className="text-sm text-gray-600">Confirmed</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                        <div className="text-sm text-gray-600">Cancelled</div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex space-x-2 mb-6">
                    {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status !== 'all' && ` (${stats[status]})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings Table */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tour
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {booking.contactPerson?.name || 'Unknown User'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {booking.contactPerson?.email || 'No email'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {booking.tourId?.title || 'Tour not found'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                📍 {booking.tourId?.location || 'Unknown location'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(booking.bookingDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            ${booking.totalAmount || 0}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {booking.numberOfTravelers || 1} travelers
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {booking.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        {booking.status === 'cancelled' && (
                                            <span className="text-gray-400 text-xs">No actions</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                {filter === 'all'
                                    ? 'No bookings found.'
                                    : `No ${filter} bookings found.`
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingManager;
