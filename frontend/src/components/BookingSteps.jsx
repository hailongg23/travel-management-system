import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/bookingService';

const BookingSteps = ({ tour, isOpen, onClose, onBookingComplete }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        adults: 1,
        children: 0,
        specialRequests: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    });

    const steps = [
        { id: 1, title: 'Travel Details', icon: '📅' },
        { id: 2, title: 'Personal Info', icon: '👤' },
        { id: 3, title: 'Payment', icon: '💳' },
        { id: 4, title: 'Confirmation', icon: '✅' }
    ];

    useEffect(() => {
        if (tour && isOpen) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const endDate = new Date(tomorrow);
            endDate.setDate(tomorrow.getDate() + (tour.duration || 3));

            setFormData(prev => ({
                ...prev,
                startDate: tomorrow.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            }));
        }
    }, [tour?._id, isOpen]); // Only depend on tour ID and isOpen to avoid infinite loops

    // Function to automatically calculate end date based on start date and tour duration
    const handleStartDateChange = (startDate) => {
        if (!startDate || !tour?.duration) {
            setFormData(prev => ({ ...prev, startDate, endDate: '' }));
            return;
        }

        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + tour.duration);

        setFormData(prev => ({
            ...prev,
            startDate,
            endDate: end.toISOString().split('T')[0]
        }));
    };

    const calculateTotalPrice = () => {
        if (!tour) return 0;
        const basePrice = tour.price || 0;
        const adultPrice = basePrice * formData.adults;
        const childPrice = basePrice * 0.7 * formData.children;
        return Math.round(adultPrice + childPrice);
    };

    const isStepValid = (step) => {
        switch (step) {
            case 1:
                return formData.startDate && formData.endDate &&
                    formData.adults > 0 &&
                    new Date(formData.startDate) > new Date() && // Must be future date
                    new Date(formData.endDate) > new Date(formData.startDate); // End date after start date
            case 2:
                return formData.fullName && formData.fullName.trim().length > 0 &&
                    formData.email && formData.email.includes('@') &&
                    formData.phone && formData.phone.trim().length > 0 &&
                    formData.address && formData.address.trim().length > 0;
            case 3:
                return formData.cardNumber && formData.cardNumber.length >= 13 &&
                    formData.expiryDate && formData.expiryDate.length >= 4 &&
                    formData.cvv && formData.cvv.length >= 3 &&
                    formData.cardholderName && formData.cardholderName.trim().length > 0;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (currentStep < 4 && isStepValid(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Validate all required fields
            if (!formData.startDate || !formData.fullName || !formData.email || !formData.phone) {
                alert('Please fill in all required fields');
                return;
            }

            // Validate departure date is in the future
            const departureDate = new Date(formData.startDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (departureDate <= today) {
                alert('Departure date must be in the future');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Prepare travelers array
            const travelers = [];

            // Add adults
            for (let i = 0; i < formData.adults; i++) {
                travelers.push({
                    name: formData.fullName + (i > 0 ? ` (Adult ${i + 1})` : ''),
                    age: 30, // Default age for adults
                    gender: 'other', // Default gender
                    specialRequests: i === 0 ? formData.specialRequests : '' // Only add special requests for first traveler
                });
            }

            // Add children
            for (let i = 0; i < formData.children; i++) {
                travelers.push({
                    name: `Child ${i + 1} of ${formData.fullName}`,
                    age: 10, // Default age for children
                    gender: 'other',
                    specialRequests: ''
                });
            }

            const bookingData = {
                tourId: tour._id,
                departureDate: new Date(formData.startDate).toISOString(),
                numberOfTravelers: formData.adults + formData.children,
                contactPerson: {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone
                },
                travelers: travelers,
                customerNotes: formData.specialRequests || ''
            };

            console.log('Sending booking data:', bookingData);
            const result = await bookingAPI.createBooking(bookingData);

            if (result.success || result.booking || result._id) {
                setCurrentStep(4);
                setTimeout(() => {
                    onBookingComplete && onBookingComplete(result.booking || result);
                    onClose();
                    setCurrentStep(1);
                }, 3000);
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            let errorMessage = 'An error occurred. Please try again.';

            if (error.response?.data?.message) {
                if (Array.isArray(error.response.data.message)) {
                    errorMessage = error.response.data.message.join(', ');
                } else {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(`Booking failed: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        console.log('Rendering step:', currentStep);

        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Travel Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => handleStartDateChange(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                    <span className="text-xs text-gray-500 ml-2">
                                        (Auto-calculated based on tour duration: {tour?.duration || 0} days)
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adults
                                </label>
                                <select
                                    value={formData.adults}
                                    onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Children
                                </label>
                                <select
                                    value={formData.children}
                                    onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                >
                                    {[0, 1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Requests (Optional)
                            </label>
                            <textarea
                                value={formData.specialRequests}
                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Any special dietary requirements, accessibility needs, etc."
                            />
                        </div>

                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">Total Price:</span>
                                <span className="text-2xl font-bold text-emerald-600">${calculateTotalPrice()}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                                {formData.adults} Adult{formData.adults > 1 ? 's' : ''}
                                {formData.children > 0 && ` + ${formData.children} Child${formData.children > 1 ? 'ren' : ''}`}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address *
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter your address"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card Number *
                            </label>
                            <input
                                type="text"
                                value={formData.cardNumber}
                                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date *
                                </label>
                                <input
                                    type="text"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CVV *
                                </label>
                                <input
                                    type="text"
                                    value={formData.cvv}
                                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="123"
                                    maxLength={4}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cardholder Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.cardholderName}
                                    onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Name on card"
                                />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">Amount to be charged:</span>
                                <span className="text-2xl font-bold text-emerald-600">${calculateTotalPrice()}</span>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h3 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h3>

                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                            <p className="text-lg text-gray-700 mb-2">
                                Thank you for booking <strong>{tour?.title}</strong>
                            </p>
                            <p className="text-gray-600">
                                A confirmation email has been sent to <strong>{formData.email}</strong>
                            </p>
                        </div>

                        <div className="text-sm text-gray-500">
                            You will be redirected automatically...
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!isOpen || !tour) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden booking-modal flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Book Your Adventure</h2>
                            <p className="text-emerald-100 mt-1">{tour.title}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mt-6 space-x-8">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${currentStep >= step.id
                                    ? 'bg-white text-emerald-600'
                                    : 'bg-emerald-400 text-white'
                                    }`}>
                                    <span className="text-sm font-semibold">{step.id}</span>
                                </div>
                                <span className={`ml-2 text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-emerald-200'
                                    }`}>
                                    {step.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 mx-4 transition-all duration-300 ${currentStep > step.id ? 'bg-white' : 'bg-emerald-400'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-white min-h-0">
                    <div className="p-8">
                        {renderStep()}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center px-8 py-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                    <div>
                        {currentStep > 1 && currentStep < 4 && (
                            <button
                                onClick={handlePrevious}
                                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>
                        )}
                    </div>

                    <div>
                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={!isStepValid(currentStep)}
                                className="flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Next
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ) : currentStep === 3 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !isStepValid(currentStep)}
                                className="flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 012h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Confirm Booking
                                    </>
                                )}
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}; export default BookingSteps;
