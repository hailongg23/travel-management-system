import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTourStore from '../store/tourStore';
import useAuthStore from '../store/authStore';
import { tourAPI } from '../services/tourService';
import BookingSteps from '../components/BookingSteps';

const TourDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentTour, setCurrentTour, setLoading, isLoading } = useTourStore();
    const { isAuthenticated } = useAuthStore();
    const [showBookingSteps, setShowBookingSteps] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const loadTourDetail = useCallback(async () => {
        try {
            setLoading(true);
            const data = await tourAPI.getTourById(id);
            setCurrentTour(data);
        } catch (error) {
            console.error('Error loading tour detail:', error);
        } finally {
            setLoading(false);
        }
    }, [id, setCurrentTour, setLoading]);

    useEffect(() => {
        loadTourDetail();
    }, [loadTourDetail]);

    const handleBookTour = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setShowBookingSteps(true);
    };

    const handleBookingSuccess = () => {
        setShowBookingSteps(false);
        setBookingSuccess(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Tour Details</h3>
                    <p className="text-gray-500">Please wait while we prepare your adventure...</p>
                </div>
            </div>
        );
    }

    if (!currentTour) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m-3-16v3.343M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
                    <p className="text-gray-600 mb-8">We couldn't find the tour you're looking for. It might have been removed or doesn't exist.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                        Back to Tours
                    </button>
                </div>
            </div>
        );
    }

    if (bookingSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center border">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Booking Confirmed!
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Your adventure is booked! We've sent a confirmation email with all the details.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                            >
                                View My Bookings
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                            >
                                Explore More Tours
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Tours
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
                    {/* Hero Image Section */}
                    <div className="relative h-64 md:h-80 overflow-hidden">
                        {currentTour.images && currentTour.images[0] ? (
                            <img
                                src={currentTour.images[0]}
                                alt={currentTour.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // If image fails to load, show placeholder
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        {/* Placeholder for when no image or image fails to load */}
                        <div
                            className={`w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center ${currentTour.images && currentTour.images[0] ? 'hidden' : 'flex'
                                }`}
                            style={{ display: currentTour.images && currentTour.images[0] ? 'none' : 'flex' }}
                        >
                            <div className="text-center text-gray-600">
                                <div className="w-16 h-16 mx-auto mb-3 bg-gray-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="text-white">
                                    <h3 className="text-xl font-semibold">{currentTour.title}</h3>
                                    <p className="text-gray-200 text-sm mt-1">{currentTour.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-white rounded-lg px-4 py-2 shadow-lg border">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                    ${currentTour.price}
                                </div>
                                <div className="text-sm text-gray-600">
                                    per person
                                </div>
                            </div>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute top-4 left-4 bg-blue-600 text-white rounded-lg px-3 py-2 shadow-lg">
                            <div className="flex items-center text-sm font-medium">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {currentTour.duration} days
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Header Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {currentTour.title}
                            </h1>
                            <div className="flex items-center text-lg text-gray-600 mb-6">
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {currentTour.location}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Tour</h3>
                            <div className="bg-gray-50 rounded-lg p-6 border">
                                <p className="text-gray-700 leading-relaxed">
                                    {currentTour.description}
                                </p>
                            </div>
                        </div>

                        {/* Booking Section */}
                        <div className="border-t pt-8">
                            <BookingSteps
                                tour={currentTour}
                                isOpen={showBookingSteps}
                                onClose={() => setShowBookingSteps(false)}
                                onBookingComplete={handleBookingSuccess}
                            />
                            {!showBookingSteps && (
                                <div className="text-center">
                                    <div className="max-w-md mx-auto">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            Ready for an Adventure?
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Book your spot on this amazing journey and create memories that will last a lifetime.
                                        </p>
                                        <button
                                            onClick={handleBookTour}
                                            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Book This Tour
                                        </button>
                                    </div>
                                </div>
                            )}
                            {!isAuthenticated && !showBookingSteps && (
                                <div className="text-center mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-amber-800 flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        Please log in to book this tour
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetail;
