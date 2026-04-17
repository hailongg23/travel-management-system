import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import authAPI from '../services/authService';

const SessionManager = () => {
    const { user, sessionId, logout } = useAuthStore();
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            const response = await authAPI.getSessions();
            setSessions(response);
        } catch (error) {
            setError('Failed to load sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoutAll = async () => {
        try {
            await authAPI.logoutAll();
            logout();
            window.location.href = '/login';
        } catch (error) {
            setError('Failed to logout from all devices');
        }
    };

    const formatLastActivity = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / 1440)} days ago`;
    };

    const getDeviceInfo = (userAgent) => {
        if (!userAgent) return { browser: 'Unknown', os: 'Unknown' };

        let browser = 'Unknown';
        let os = 'Unknown';

        // Detect browser
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';

        // Detect OS
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS')) os = 'iOS';

        return { browser, os };
    };

    if (isLoading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
                    <button
                        onClick={handleLogoutAll}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors"
                    >
                        Logout All Devices
                    </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your active sessions across different devices
                </p>
            </div>

            {error && (
                <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="p-6">
                {sessions.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No active sessions</h3>
                        <p className="mt-1 text-sm text-gray-500">You don't have any active sessions.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session) => {
                            const isCurrentSession = session.sessionId === sessionId;
                            const deviceInfo = getDeviceInfo(session.userAgent);

                            return (
                                <div
                                    key={session.sessionId}
                                    className={`flex items-center justify-between p-4 border rounded-lg ${isCurrentSession
                                            ? 'border-blue-200 bg-blue-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCurrentSession ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}>
                                            {deviceInfo.os === 'Windows' ? (
                                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 12V6.75l6-1.32v6.48L3 12zm8-6.82L22 3v9h-11V5.18zM3 13l6-.07v6.09L3 17.57V13zm8 .53H22v9l-11-1.98v-7.02z" />
                                                </svg>
                                            ) : deviceInfo.os === 'macOS' ? (
                                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {deviceInfo.browser} on {deviceInfo.os}
                                                </p>
                                                {isCurrentSession && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span>Last activity: {formatLastActivity(session.lastActivity)}</span>
                                                {session.ipAddress && (
                                                    <span>IP: {session.ipAddress}</span>
                                                )}
                                                <span>Created: {new Date(session.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {!isCurrentSession && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    // Note: Backend doesn't have individual session logout yet
                                                    // This would need to be implemented
                                                    console.log('Logout session:', session.sessionId);
                                                } catch (error) {
                                                    setError('Failed to logout session');
                                                }
                                            }}
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            End Session
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionManager;
