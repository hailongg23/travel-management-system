import { useState, useEffect } from 'react';
import api from '../../services/api';

const SecurityManager = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [rateLimitStatus, setRateLimitStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState('');
    const [blockForm, setBlockForm] = useState({
        identifier: '',
        durationSeconds: 3600,
        category: 'blocked'
    });
    const [whitelistForm, setWhitelistForm] = useState({
        identifier: '',
        category: 'whitelist',
        durationSeconds: 86400
    });

    useEffect(() => {
        loadAuditLogs();
    }, []);

    const loadAuditLogs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/security/audit-logs');
            setAuditLogs(response.data);
        } catch (error) {
            console.error('Error loading audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRateLimitStatus = async (identifier) => {
        try {
            const response = await api.get(`/admin/rate-limit/status/${identifier}`);
            setRateLimitStatus({ ...rateLimitStatus, [identifier]: response.data });
        } catch (error) {
            console.error('Error getting rate limit status:', error);
        }
    };

    const blockUser = async () => {
        try {
            await api.post('/admin/rate-limit/block', blockForm);
            alert('User blocked successfully');
            setBlockForm({ identifier: '', durationSeconds: 3600, category: 'blocked' });
        } catch (error) {
            console.error('Error blocking user:', error);
            alert('Error blocking user');
        }
    };

    const unblockUser = async (identifier) => {
        try {
            await api.delete(`/admin/rate-limit/block/${identifier}`);
            alert('User unblocked successfully');
        } catch (error) {
            console.error('Error unblocking user:', error);
            alert('Error unblocking user');
        }
    };

    const addToWhitelist = async () => {
        try {
            await api.post('/admin/rate-limit/whitelist', whitelistForm);
            alert('Added to whitelist successfully');
            setWhitelistForm({ identifier: '', category: 'whitelist', durationSeconds: 86400 });
        } catch (error) {
            console.error('Error adding to whitelist:', error);
            alert('Error adding to whitelist');
        }
    };

    const removeFromWhitelist = async (identifier) => {
        try {
            await api.delete(`/admin/rate-limit/whitelist/${identifier}`);
            alert('Removed from whitelist successfully');
        } catch (error) {
            console.error('Error removing from whitelist:', error);
            alert('Error removing from whitelist');
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const getStatusBadge = (status) => {
        return status === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Management</h1>
                <p className="text-gray-600">Monitor and manage system security</p>
            </div>

            {/* Rate Limit Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Block User */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Block User/IP</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="User ID or IP Address"
                            value={blockForm.identifier}
                            onChange={(e) => setBlockForm({ ...blockForm, identifier: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            placeholder="Duration in seconds"
                            value={blockForm.durationSeconds}
                            onChange={(e) => setBlockForm({ ...blockForm, durationSeconds: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={blockUser}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                        >
                            Block User
                        </button>
                    </div>
                </div>

                {/* Whitelist User */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add to Whitelist</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="User ID or IP Address"
                            value={whitelistForm.identifier}
                            onChange={(e) => setWhitelistForm({ ...whitelistForm, identifier: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            placeholder="Duration in seconds"
                            value={whitelistForm.durationSeconds}
                            onChange={(e) => setWhitelistForm({ ...whitelistForm, durationSeconds: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={addToWhitelist}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                        >
                            Add to Whitelist
                        </button>
                    </div>
                </div>
            </div>

            {/* Rate Limit Status Check */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Check Rate Limit Status</h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="User ID or IP Address"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => getRateLimitStatus(selectedUser)}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Check Status
                    </button>
                </div>

                {rateLimitStatus[selectedUser] && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <pre className="text-sm">{JSON.stringify(rateLimitStatus[selectedUser], null, 2)}</pre>
                    </div>
                )}
            </div>

            {/* Audit Logs */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Security Audit Logs</h3>
                    <button
                        onClick={loadAuditLogs}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Refresh
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IP Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {auditLogs.map((log, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatTimestamp(log.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.userId || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.ipAddress || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(log.success ? 'success' : 'failed')}`}>
                                            {log.success ? 'Success' : 'Failed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                        {log.details || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {auditLogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No audit logs found
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityManager;
