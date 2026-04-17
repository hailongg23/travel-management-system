import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/bookingService';

const BookingForm = ({ tour, onSuccess, onCancel }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        departureDate: '',
        numberOfTravelers: 1,
        contactPerson: {
            name: '',
            email: '',
            phone: '',
        },
        travelers: [
            {
                name: '',
                age: '',
                gender: 'male',
                identityNumber: '',
                specialRequests: '',
            }
        ],
        customerNotes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleNumberOfTravelersChange = (number) => {
        const newTravelers = [...formData.travelers];

        if (number > newTravelers.length) {
            // Add new travelers
            for (let i = newTravelers.length; i < number; i++) {
                newTravelers.push({
                    name: '',
                    age: '',
                    gender: 'male',
                    identityNumber: '',
                    specialRequests: '',
                });
            }
        } else {
            // Remove excess travelers
            newTravelers.splice(number);
        }

        setFormData({
            ...formData,
            numberOfTravelers: number,
            travelers: newTravelers,
        });
    };

    const handleTravelerChange = (index, field, value) => {
        const newTravelers = [...formData.travelers];
        newTravelers[index] = {
            ...newTravelers[index],
            [field]: value,
        };
        setFormData({
            ...formData,
            travelers: newTravelers,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate departure date
        if (!formData.departureDate) {
            newErrors.departureDate = 'Departure date is required';
        } else {
            const departureDate = new Date(formData.departureDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (departureDate <= today) {
                newErrors.departureDate = 'Departure date must be in the future';
            }
        }

        // Validate contact person
        if (!formData.contactPerson.name) {
            newErrors['contactPerson.name'] = 'Contact name is required';
        }
        if (!formData.contactPerson.email) {
            newErrors['contactPerson.email'] = 'Contact email is required';
        }
        if (!formData.contactPerson.phone) {
            newErrors['contactPerson.phone'] = 'Contact phone is required';
        }

        // Validate travelers
        formData.travelers.forEach((traveler, index) => {
            if (!traveler.name) {
                newErrors[`traveler.${index}.name`] = 'Traveler name is required';
            }
            if (!traveler.age || traveler.age < 1 || traveler.age > 120) {
                newErrors[`traveler.${index}.age`] = 'Valid age is required (1-120)';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);

            const bookingData = {
                tourId: tour._id,
                departureDate: formData.departureDate,
                numberOfTravelers: formData.numberOfTravelers,
                contactPerson: formData.contactPerson,
                travelers: formData.travelers.map(t => ({
                    ...t,
                    age: parseInt(t.age),
                })),
                customerNotes: formData.customerNotes,
            };

            const response = await bookingAPI.createBooking(bookingData);

            // Show success message with email confirmation
            alert(`✅ Booking created successfully!\n\n📧 A confirmation email has been sent to: ${formData.contactPerson.email}\n\nBooking ID: ${response.data._id}\nPlease check your email for details.`);

            onSuccess();
        } catch (error) {
            console.error('Error creating booking:', error);
            alert(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalAmount = tour.price * formData.numberOfTravelers;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Book Your Tour</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tour Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">{tour.title}</h3>
                            <p className="text-gray-600">📍 {tour.location}</p>
                            <p className="text-gray-600">⏱️ {tour.duration} days</p>
                            <p className="text-blue-600 font-semibold text-lg">${tour.price} per person</p>
                        </div>

                        {/* Departure Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Departure Date *
                            </label>
                            <input
                                type="date"
                                value={formData.departureDate}
                                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.departureDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>}
                        </div>

                        {/* Number of Travelers */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Travelers *
                            </label>
                            <select
                                value={formData.numberOfTravelers}
                                onChange={(e) => handleNumberOfTravelersChange(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                                ))}
                            </select>
                        </div>

                        {/* Contact Person */}
                        <div className="border-t pt-6">
                            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            contactPerson: { ...formData.contactPerson, name: e.target.value }
                                        })}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors['contactPerson.name'] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors['contactPerson.name'] && <p className="text-red-500 text-sm mt-1">{errors['contactPerson.name']}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.contactPerson.email}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            contactPerson: { ...formData.contactPerson, email: e.target.value }
                                        })}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors['contactPerson.email'] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors['contactPerson.email'] && <p className="text-red-500 text-sm mt-1">{errors['contactPerson.email']}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contactPerson.phone}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            contactPerson: { ...formData.contactPerson, phone: e.target.value }
                                        })}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors['contactPerson.phone'] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors['contactPerson.phone'] && <p className="text-red-500 text-sm mt-1">{errors['contactPerson.phone']}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Travelers Information */}
                        <div className="border-t pt-6">
                            <h4 className="text-lg font-semibold mb-4">Travelers Information</h4>
                            {formData.travelers.map((traveler, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                                    <h5 className="font-medium mb-3">Traveler {index + 1}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={traveler.name}
                                                onChange={(e) => handleTravelerChange(index, 'name', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors[`traveler.${index}.name`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors[`traveler.${index}.name`] && <p className="text-red-500 text-sm mt-1">{errors[`traveler.${index}.name`]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Age *
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="120"
                                                value={traveler.age}
                                                onChange={(e) => handleTravelerChange(index, 'age', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors[`traveler.${index}.age`] ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors[`traveler.${index}.age`] && <p className="text-red-500 text-sm mt-1">{errors[`traveler.${index}.age`]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Gender *
                                            </label>
                                            <select
                                                value={traveler.gender}
                                                onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ID Number
                                            </label>
                                            <input
                                                type="text"
                                                value={traveler.identityNumber}
                                                onChange={(e) => handleTravelerChange(index, 'identityNumber', e.target.value)}
                                                placeholder="CMND/CCCD"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Special Requests
                                        </label>
                                        <input
                                            type="text"
                                            value={traveler.specialRequests}
                                            onChange={(e) => handleTravelerChange(index, 'specialRequests', e.target.value)}
                                            placeholder="Dietary restrictions, accessibility needs, etc."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Customer Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                value={formData.customerNotes}
                                onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                                rows={3}
                                placeholder="Any additional requests or information..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Total Amount */}
                        <div className="border-t pt-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>Total Amount:</span>
                                    <span className="text-blue-600">${totalAmount.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    ${tour.price} × {formData.numberOfTravelers} {formData.numberOfTravelers === 1 ? 'person' : 'people'}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
