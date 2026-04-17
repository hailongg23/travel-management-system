import { useState } from 'react';

const BookingDetailModal = ({ booking, isOpen, onClose }) => {
    if (!isOpen || !booking) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusInfo = (status) => {
        const statusConfig = {
            pending: { label: 'Pending Confirmation', color: 'bg-yellow-100 text-yellow-800' },
            confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800' },
            cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
        };
        return statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    const statusInfo = getStatusInfo(booking.status);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                            <p className="text-gray-600">Booking ID: #{booking._id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Status Banner */}
                    <div className={`${statusInfo.color} rounded-lg p-4 mb-6`}>
                        <div>
                            <h3 className="font-semibold">Status: {statusInfo.label}</h3>
                            <p className="text-sm opacity-90">
                                {booking.status === 'pending' && 'Your booking is awaiting confirmation from our consultation team'}
                                {booking.status === 'confirmed' && 'Booking has been confirmed. Get ready for your trip!'}
                                {booking.status === 'cancelled' && 'Booking has been cancelled. Please contact us for more details.'}
                                {booking.status === 'completed' && 'Trip has been completed. Thank you for using our service!'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Tour Information */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Tour Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Tour name:</span>
                                    <p className="text-gray-900 font-medium">{booking.tourId?.title || 'No information'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Location:</span>
                                    <p className="text-gray-900">{booking.tourId?.location || 'No information'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Departure date:</span>
                                    <p className="text-gray-900">{formatDate(booking.departureDate)}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Duration:</span>
                                    <p className="text-gray-900">{booking.tourId?.duration || 'No information'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Booking Details
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Booking date:</span>
                                    <p className="text-gray-900">{formatDate(booking.bookingDate || booking.createdAt)}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Number of travelers:</span>
                                    <p className="text-gray-900 font-medium">{booking.numberOfTravelers} people</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Price per person:</span>
                                    <p className="text-gray-900">{formatCurrency(booking.tourId?.price || 0)}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Total amount:</span>
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(booking.totalAmount)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Person */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Full name:</span>
                                <p className="text-gray-900 font-medium">{booking.contactPerson?.name || 'No information'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Email:</span>
                                <p className="text-gray-900">{booking.contactPerson?.email || 'No information'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Phone number:</span>
                                <p className="text-gray-900">{booking.contactPerson?.phone || 'No information'}</p>
                            </div>
                        </div>

                        {/* Email Notification Info */}
                        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                            <div className="text-sm text-gray-700">
                                <p className="font-medium">Email Notification</p>
                                <p className="mt-1">Notifications will be sent to: <span className="font-medium">{booking.contactPerson?.email}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Travelers List */}
                    {booking.travelers && booking.travelers.length > 0 && (
                        <div className="mt-6 bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Travelers list ({booking.travelers.length} people)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {booking.travelers.map((traveler, index) => (
                                    <div key={index} className="bg-white rounded-lg p-4 border">
                                        <h4 className="font-medium text-gray-900 mb-2">Traveler {index + 1}</h4>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="text-gray-600">Full name: </span>
                                                <span className="text-gray-900 font-medium">{traveler.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Age: </span>
                                                <span className="text-gray-900">{traveler.age} years old</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Gender: </span>
                                                <span className="text-gray-900">
                                                    {traveler.gender === 'male' ? 'Male' :
                                                        traveler.gender === 'female' ? 'Female' : 'Other'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {(booking.customerNotes || booking.adminNotes) && (
                        <div className="mt-6 space-y-4">
                            {booking.customerNotes && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Customer notes:
                                    </h4>
                                    <p className="text-gray-700">{booking.customerNotes}</p>
                                </div>
                            )}

                            {booking.adminNotes && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Admin Notes:
                                    </h4>
                                    <p className="text-gray-700">{booking.adminNotes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cancellation Info */}
                    {booking.status === 'cancelled' && (
                        <div className="mt-6 bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">
                                Booking Cancellation Information
                            </h4>
                            <div className="space-y-2 text-sm text-gray-700">
                                {booking.cancellationReason && (
                                    <div>
                                        <span className="font-medium">Cancellation Reason: </span>
                                        <span>{booking.cancellationReason}</span>
                                    </div>
                                )}
                                {booking.cancelledAt && (
                                    <div>
                                        <span className="font-medium">Cancellation Date: </span>
                                        <span>{formatDate(booking.cancelledAt)}</span>
                                    </div>
                                )}
                                <div className="mt-3 p-3 bg-gray-100 rounded">
                                    <p className="text-xs text-gray-600">
                                        Refund information will be sent via email within 7-10 business days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end pt-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;
