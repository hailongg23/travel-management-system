import { useState } from 'react';

const CancelBookingModal = ({ booking, isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const predefinedReasons = [
        'Personal plan changes',
        'Financial issues',
        'Health reasons',
        'Weather conditions',
        'Visa/document issues',
        'Other reasons'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason) {
            alert('Please select a cancellation reason');
            return;
        }

        if (reason === 'Other reasons' && !customReason.trim()) {
            alert('Please enter a specific reason');
            return;
        }

        const finalReason = reason === 'Other reasons' ? customReason : reason;

        try {
            setIsSubmitting(true);
            await onConfirm(booking._id, finalReason);
            handleClose();
        } catch (error) {
            console.error('Error cancelling booking:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setReason('');
        setCustomReason('');
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    // Check if booking can be cancelled
    const now = new Date();
    const departureDate = new Date(booking.departureDate);
    const hoursUntilDeparture = (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const canCancel = hoursUntilDeparture >= 24 && booking.status !== 'cancelled' && booking.status !== 'completed';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Cancel Booking</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                            disabled={isSubmitting}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Booking Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-gray-900 mb-2">{booking.tourId?.title}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>📍 {booking.tourId?.location}</div>
                            <div>📅 Departure: {new Date(booking.departureDate).toLocaleDateString('en-US')}</div>
                            <div>👥 {booking.numberOfTravelers} travelers</div>
                            <div>💰 {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(booking.totalAmount)}</div>
                        </div>
                    </div>

                    {/* Cancellation Policy Warning */}
                    {!canCancel ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h4 className="text-red-800 font-medium">Cannot cancel booking</h4>
                                    <p className="text-red-700 text-sm mt-1">
                                        {booking.status === 'cancelled'
                                            ? 'This booking has already been cancelled.'
                                            : booking.status === 'completed'
                                                ? 'This booking has been completed.'
                                                : 'Bookings can only be cancelled 24 hours before departure.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Cancellation Policy */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="text-yellow-800 font-medium">Cancellation Policy</h4>
                                        <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                                            <li>• Cancel before 24h: 100% refund</li>
                                            <li>• Cancel within 24h: No refund</li>
                                            <li>• Refund processing: 7-10 business days</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Cancellation Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Cancellation reason <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        {predefinedReasons.map((reasonOption) => (
                                            <label key={reasonOption} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="reason"
                                                    value={reasonOption}
                                                    checked={reason === reasonOption}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    className="mr-3"
                                                    disabled={isSubmitting}
                                                />
                                                <span className="text-sm text-gray-700">{reasonOption}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Reason Input */}
                                {reason === 'Other reasons' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Enter specific reason <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={customReason}
                                            onChange={(e) => setCustomReason(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Please describe your cancellation reason..."
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        disabled={isSubmitting || !reason}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </div>
                                        ) : (
                                            'Confirm Cancellation'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CancelBookingModal;
