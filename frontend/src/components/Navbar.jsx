import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/authService';

const Navbar = () => {
    const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleLogout = async () => {
        try {
            // Call backend logout API first
            await authAPI.logout();
        } catch (error) {
            console.error('Logout API error:', error);
            // Continue with frontend logout even if API fails
        } finally {
            // Clear frontend state
            logout();
            navigate('/');
            setShowUserMenu(false);
        }
    };

    // Get user avatar or generate initials
    const getUserAvatar = () => {
        if (user?.avatar) {
            return user.avatar;
        }
        // Generate avatar based on user initials
        return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3B82F6&color=fff&size=40`;
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.user-menu-container')) {
                setShowUserMenu(false);
            }
            if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu, showMobileMenu]);

    return (
        <>
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-xl font-bold text-gray-900">TravelCo</Link>
                            <div className="hidden md:flex space-x-6">
                                <Link
                                    to="/"
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/tours"
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Tours
                                </Link>
                                {isAuthenticated && !isAdmin() && (
                                    <Link
                                        to="/my-bookings"
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        My Bookings
                                    </Link>
                                )}
                                {isAuthenticated && isAdmin() && (
                                    <>
                                        <Link
                                            to="/admin"
                                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/admin/tours"
                                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Manage Tours
                                        </Link>
                                        <Link
                                            to="/admin/bookings"
                                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Manage Bookings
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mobile-menu-container"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="relative user-menu-container">
                                    {/* User Avatar with Dropdown */}
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        <img
                                            src={getUserAvatar()}
                                            alt={user?.name || 'User'}
                                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                                        />
                                        <div className="hidden sm:block text-left">
                                            <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                                            <div className="text-xs text-gray-500">{user?.email}</div>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 sm:right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 transform -translate-x-2 sm:translate-x-0">
                                            <div className="px-3 py-2 border-b border-gray-100">
                                                <div className="flex items-center space-x-2">
                                                    <img
                                                        src={getUserAvatar()}
                                                        alt={user?.name || 'User'}
                                                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex-shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-medium text-gray-900 truncate text-sm">{user?.name}</div>
                                                        <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="py-1">
                                                {!isAdmin() && (
                                                    <Link
                                                        to="/my-bookings"
                                                        onClick={() => setShowUserMenu(false)}
                                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                                    >
                                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                        <span>My Bookings</span>
                                                    </Link>
                                                )}

                                                {isAdmin() && (
                                                    <>
                                                        <Link
                                                            to="/admin"
                                                            onClick={() => setShowUserMenu(false)}
                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                                        >
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                            </svg>
                                                            <span>Dashboard</span>
                                                        </Link>
                                                        <Link
                                                            to="/admin/tours"
                                                            onClick={() => setShowUserMenu(false)}
                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                                        >
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span>Tours</span>
                                                        </Link>
                                                        <Link
                                                            to="/admin/bookings"
                                                            onClick={() => setShowUserMenu(false)}
                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                                        >
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            <span>Bookings</span>
                                                        </Link>
                                                    </>
                                                )}

                                                <Link
                                                    to="/profile"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                                >
                                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>Profile & Settings</span>
                                                </Link>

                                                <Link
                                                    to="/sessions"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                                >
                                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>Active Sessions</span>
                                                </Link>

                                                <div className="border-t border-gray-100 my-1"></div>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                                >
                                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/login"
                                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="md:hidden bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-2 space-y-1">
                        <Link
                            to="/"
                            onClick={() => setShowMobileMenu(false)}
                            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Home
                        </Link>
                        <Link
                            to="/tours"
                            onClick={() => setShowMobileMenu(false)}
                            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Tours
                        </Link>
                        {isAuthenticated && !isAdmin() && (
                            <Link
                                to="/my-bookings"
                                onClick={() => setShowMobileMenu(false)}
                                className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            >
                                My Bookings
                            </Link>
                        )}
                        {isAuthenticated && isAdmin() && (
                            <>
                                <Link
                                    to="/admin"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/admin/tours"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Manage Tours
                                </Link>
                            </>
                        )}
                        {!isAuthenticated && (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
