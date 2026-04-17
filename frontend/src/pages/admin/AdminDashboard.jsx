import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTourStore from '../../store/tourStore';
import useBookingStore from '../../store/bookingStore';
import { tourAPI } from '../../services/tourService';
import { bookingAPI } from '../../services/bookingService';

const AdminDashboard = () => {
    const { tours, setTours } = useTourStore();
    const { bookings, setBookings } = useBookingStore();
    const [stats, setStats] = useState({
        totalTours: 0,
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load tours and bookings
            const [toursData, bookingsData] = await Promise.all([
                tourAPI.getTours(),
                bookingAPI.getAllBookings(),
            ]);

            setTours(toursData);
            setBookings(bookingsData);

            // Calculate stats
            const pendingCount = bookingsData.filter(b => b.status === 'pending').length;
            const confirmedCount = bookingsData.filter(b => b.status === 'confirmed').length;

            setStats({
                totalTours: toursData.length,
                totalBookings: bookingsData.length,
                pendingBookings: pendingCount,
                confirmedBookings: confirmedCount,
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const StatCard = ({ title, value, color, icon }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage your travel booking system</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Tours"
                    value={stats.totalTours}
                    color="bg-blue-100"
                    icon="🎯"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    color="bg-green-100"
                    icon="📊"
                />
                <StatCard
                    title="Pending Bookings"
                    value={stats.pendingBookings}
                    color="bg-yellow-100"
                    icon="⏳"
                />
                <StatCard
                    title="Confirmed Bookings"
                    value={stats.confirmedBookings}
                    color="bg-emerald-100"
                    icon="✅"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            to="/admin/tours"
                            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Manage Tours
                        </Link>
                        <Link
                            to="/admin/bookings"
                            className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Manage Bookings
                        </Link>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
                    <div className="space-y-3">
                        {bookings.slice(0, 5).map((booking) => (
                            <div key={booking._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {booking.tourId?.title || 'Tour'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(booking.bookingDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${booking.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : booking.status === 'confirmed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                        {bookings.length === 0 && (
                            <p className="text-gray-500 text-sm">No bookings yet</p>
                        )}
                    </div>
                    {bookings.length > 5 && (
                        <Link
                            to="/admin/bookings"
                            className="block text-center text-blue-600 hover:text-blue-800 text-sm mt-4"
                        >
                            View all bookings →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
