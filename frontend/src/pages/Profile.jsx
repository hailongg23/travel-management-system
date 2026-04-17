import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import authService from '../services/authService';

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Security settings state
    const [securitySettings, setSecuritySettings] = useState({
        emailNotifications: true
    });

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
            });
            setSecuritySettings({
                emailNotifications: user.settings?.emailNotifications ?? true
            });
        }
    }, [user]);

    // Handle URL fragments for direct tab navigation
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const validTabs = ['profile', 'password', 'security', 'sessions'];
        if (hash && validTabs.includes(hash)) {
            setActiveTab(hash);
        }
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Only send fields that have values
            const updateData = {};
            if (profileForm.name.trim()) updateData.name = profileForm.name.trim();
            if (profileForm.email.trim()) updateData.email = profileForm.email.trim();
            if (profileForm.phone.trim()) updateData.phone = profileForm.phone.trim();
            if (profileForm.address.trim()) updateData.address = profileForm.address.trim();
            if (profileForm.dateOfBirth.trim()) updateData.dateOfBirth = profileForm.dateOfBirth.trim();

            const response = await authService.updateProfile(updateData);
            updateUser(response.user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false); // Close edit mode after successful update
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to change password'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSecurityUpdate = async (setting, value) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const newSettings = { ...securitySettings, [setting]: value };
            await authService.updateSecuritySettings(newSettings);
            setSecuritySettings(newSettings);
            setMessage({ type: 'success', text: 'Security settings updated!' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update security settings'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        const password = window.prompt('Please enter your password to confirm account deletion:');
        if (!password) return;

        setLoading(true);
        try {
            await authService.deleteAccount({ password });
            logout();
            navigate('/');
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to delete account'
            });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', name: 'Profile Information', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'password', name: 'Password & Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
        { id: 'security', name: 'Security Settings', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { id: 'sessions', name: 'Active Sessions', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                                <p className="text-sm text-gray-600 mt-1">Manage your account settings and preferences</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3B82F6&color=fff&size=60`}
                                    alt={user?.name || 'User'}
                                    className="w-15 h-15 rounded-full border-2 border-gray-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        window.location.hash = tab.id;
                                    }}
                                    className={`${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                    </svg>
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Content */}
                <div className="bg-white rounded-lg shadow">
                    {activeTab === 'profile' && (
                        <div className="p-6 space-y-6">
                            {/* Personal Information Section */}
                            <div className="border border-gray-200 rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            {isEditing ? 'Cancel' : 'Edit'}
                                        </button>
                                    </div>
                                </div>

                                <div className="px-6 py-6">
                                    {!isEditing ? (
                                        /* Display Mode */
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-sm text-gray-500">Full Name</p>
                                                <p className="text-base text-gray-900 mt-1">{user?.name || 'Not provided'}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">Email Address</p>
                                                <p className="text-base text-gray-900 mt-1">{user?.email || 'Not provided'}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">Phone Number</p>
                                                <p className="text-base text-gray-900 mt-1">{user?.phone || 'Not provided'}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">Date of Birth</p>
                                                <p className="text-base text-gray-900 mt-1">
                                                    {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                                                </p>
                                            </div>

                                            <div className="md:col-span-2">
                                                <p className="text-sm text-gray-500">Address</p>
                                                <p className="text-base text-gray-900 mt-1">{user?.address || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Edit Mode */
                                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={profileForm.name}
                                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={profileForm.email}
                                                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={profileForm.phone}
                                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Enter your phone number"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Date of Birth
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={profileForm.dateOfBirth}
                                                        onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Address
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={profileForm.address}
                                                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter your address"
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    {loading ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Account Statistics */}
                            <div className="border border-gray-200 rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Account Overview</h3>
                                </div>
                                <div className="px-6 py-6">
                                    <div className="grid grid-cols-3 gap-6 text-center">
                                        <div>
                                            <p className="text-2xl font-semibold text-gray-900">0</p>
                                            <p className="text-sm text-gray-500">Total Bookings</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-semibold text-gray-900">0</p>
                                            <p className="text-sm text-gray-500">Completed Tours</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-semibold text-gray-900">$0</p>
                                            <p className="text-sm text-gray-500">Total Spent</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit} className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Change Password</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        minLength="6"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        minLength="6"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Forgot your password?
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                                        <p className="text-sm text-gray-500">Receive security alerts via email</p>
                                    </div>
                                    <button
                                        onClick={() => handleSecurityUpdate('emailNotifications', !securitySettings.emailNotifications)}
                                        className={`${securitySettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                    >
                                        <span
                                            className={`${securitySettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                                                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                        />
                                    </button>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Danger Zone</h4>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                    >
                                        Delete Account
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        This action cannot be undone. All your data will be permanently removed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sessions' && (
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Active Sessions</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Manage your active sessions across different devices
                            </p>
                            <button
                                onClick={() => navigate('/sessions')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                                View All Sessions
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
