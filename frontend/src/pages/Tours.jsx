import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTourStore from '../store/tourStore';
import { tourAPI } from '../services/tourService';

const Tours = () => {
    const { tours, setTours, setLoading, isLoading } = useTourStore();
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredTours = Array.isArray(tours) ? tours.filter(tour =>
        tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // Generate simple placeholder image to avoid CORS issues
    const getPlaceholderImage = (tour) => {
        // Return a simple placeholder that won't cause CORS issues
        return `https://via.placeholder.com/400x300/6b7280/ffffff?text=${encodeURIComponent(tour?.title || 'Tour Image')}`;
    };

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        e.target.nextElementSibling.style.display = 'flex';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore All Tours</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover amazing destinations and create memories that last a lifetime
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tours or destinations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tours Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTours.map((tour) => (
                            <div key={tour._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={tour.images?.[0] || getPlaceholderImage(tour)}
                                        alt={tour.title}
                                        onError={handleImageError}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Fallback gray background when image fails */}
                                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500" style={{ display: 'none' }}>
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            ${tour.price}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                            {tour.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {tour.location}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-4 min-h-[4.5rem]">
                                            {tour.description?.length > 120
                                                ? `${tour.description.substring(0, 120)}...`
                                                : tour.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {tour.duration} days
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Max {tour.maxGroupSize}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/tour/${tour._id}`}
                                        className="mt-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-center block"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredTours.length === 0 && (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.267-5.365-3.055A7.963 7.963 0 015 9c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No tours found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tours;
