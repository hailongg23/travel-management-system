import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTourStore from '../store/tourStore';
import { tourAPI } from '../services/tourService';

const Home = () => {
    const {
        tours,
        setTours,
        setLoading,
        isLoading,
        filters,
        setFilters,
        getFilteredTours
    } = useTourStore();

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

    const handleSearch = () => {
        setFilters({ search: searchTerm });
    };

    const filteredTours = getFilteredTours();
    // Only show 6 featured tours on home page
    const featuredTours = filteredTours.slice(0, 6);

    // Generate placeholder image based on tour content
    const getPlaceholderImage = (tour) => {
        const combined = `${tour.title} ${tour.location} ${tour.description}`.toLowerCase();

        if (combined.includes('paris') || combined.includes('france') || combined.includes('eiffel')) {
            return 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&auto=format';
        } else if (combined.includes('tokyo') || combined.includes('japan') || combined.includes('mount fuji')) {
            return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop&auto=format';
        } else if (combined.includes('bali') || combined.includes('indonesia')) {
            return 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop&auto=format';
        } else if (combined.includes('santorini') || combined.includes('greece')) {
            return 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop&auto=format';
        } else if (combined.includes('maldives')) {
            return 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop&auto=format';
        } else if (combined.includes('beach') || combined.includes('island') || combined.includes('paradise')) {
            return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format';
        } else if (combined.includes('mountain') || combined.includes('hill') || combined.includes('trek')) {
            return 'https://images.unsplash.com/photo-1464822759844-d150baef493e?w=400&h=300&fit=crop&auto=format';
        } else if (combined.includes('city') || combined.includes('urban')) {
            return 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop&auto=format';
        } else {
            // Fallback images
            const fallbackImages = [
                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format',
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&auto=format',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop&auto=format',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format',
                'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400&h=300&fit=crop&auto=format',
                'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop&auto=format'
            ];
            const index = tour._id ? tour._id.length % fallbackImages.length : 0;
            return fallbackImages[index];
        }
    };

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        e.target.nextElementSibling.style.display = 'flex';
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                            Discover Amazing
                            <span className="block text-blue-400">Adventures</span>
                        </h1>
                        <p className="text-xl lg:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
                            Explore breathtaking destinations and create memories that last a lifetime with our curated travel experiences.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-lg p-2 shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Where do you want to go?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-4 py-3 text-gray-900 rounded-lg border-0 focus:outline-none text-lg"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tours Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Featured Tours
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our most popular destinations and experiences carefully selected for you.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-300 border-t-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading tours...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredTours.map((tour) => (
                                <div key={tour._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                                    <div className="h-48 bg-gray-300 relative overflow-hidden flex-shrink-0">
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <h3 className="text-xl font-semibold line-clamp-1 mb-1">{tour.title}</h3>
                                            <p className="text-gray-200 text-sm line-clamp-1">{tour.location}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex-grow">
                                            <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                                                {tour.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-sm text-gray-500">
                                                    <span className="font-medium">{tour.duration}</span> days
                                                </div>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    ${tour.price}
                                                </div>
                                            </div>

                                            <Link
                                                to={`/tour/${tour._id}`}
                                                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Show "View All Tours" button if there are more tours */}
                        {filteredTours.length > 6 && (
                            <div className="text-center mt-12">
                                <Link
                                    to="/tours"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    View All Tours
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {!isLoading && featuredTours.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No tours found. Try adjusting your search.</p>
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose Us
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We make your travel dreams come true with professional service and unforgettable experiences.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl text-white font-bold">✓</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Price Guarantee</h3>
                            <p className="text-gray-600">We ensure you get the best value for your money with competitive pricing.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl text-white font-bold">24</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                            <p className="text-gray-600">Round-the-clock customer support to assist you throughout your journey.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl text-white font-bold">★</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Guides</h3>
                            <p className="text-gray-600">Professional local guides who know the best spots and hidden gems.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
