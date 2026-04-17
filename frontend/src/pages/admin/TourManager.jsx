import { useState, useEffect } from 'react';
import useTourStore from '../../store/tourStore';
import { tourAPI } from '../../services/tourService';

const TourManager = () => {
    const { tours, setTours, setLoading, isLoading } = useTourStore();
    const [showForm, setShowForm] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        location: '',
        images: [],
    });

    useEffect(() => {
        loadTours();
    }, []);

    const loadTours = async () => {
        try {
            setLoading(true);
            const data = await tourAPI.getTours();
            setTours(data);
        } catch (error) {
            console.error('Error loading tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const tourData = {
                ...formData,
                price: parseFloat(formData.price),
                duration: parseInt(formData.duration),
            };

            if (editingTour) {
                await tourAPI.updateTour(editingTour._id, tourData);
            } else {
                await tourAPI.createTour(tourData);
            }

            await loadTours();
            resetForm();
        } catch (error) {
            console.error('Error saving tour:', error);
            alert('Failed to save tour. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tour) => {
        setEditingTour(tour);
        setFormData({
            title: tour.title,
            description: tour.description,
            price: tour.price.toString(),
            duration: tour.duration.toString(),
            location: tour.location,
            images: tour.images || [],
        });
        setShowForm(true);
    };

    const handleDelete = async (tourId) => {
        if (window.confirm('Are you sure you want to delete this tour?')) {
            try {
                await tourAPI.deleteTour(tourId);
                await loadTours();
            } catch (error) {
                console.error('Error deleting tour:', error);
                alert('Failed to delete tour. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            duration: '',
            location: '',
            images: [],
        });
        setEditingTour(null);
        setShowForm(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tour Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add New Tour
                </button>
            </div>

            {/* Tour Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">
                            {editingTour ? 'Edit Tour' : 'Add New Tour'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tour Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration (days)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : editingTour ? 'Update Tour' : 'Create Tour'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tours List */}
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
                                    Tour
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tours.map((tour) => (
                                <tr key={tour._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {tour.title}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {tour.description}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tour.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${tour.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tour.duration} days
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(tour)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tour._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {tours.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No tours found. Create your first tour!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TourManager;
