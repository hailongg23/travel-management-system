import { useState } from 'react';
import { Link } from 'react-router-dom';
import authAPI from '../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const response = await authAPI.forgotPassword(email);
            setMessage(response.message);
            setIsSubmitted(true);
        } catch (error) {
            if (error.response?.status === 429) {
                setError('Too many reset attempts. Please try again later.');
            } else {
                setError(error.response?.data?.message || 'Failed to send reset email');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link to="/" className="text-2xl font-bold text-gray-900">TravelCo</Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        {isSubmitted ? 'Check your email' : 'Forgot your password?'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isSubmitted
                            ? "We've sent a password reset link to your email address."
                            : "Enter your email address and we'll send you a link to reset your password."
                        }
                    </p>
                </div>

                {!isSubmitted ? (
                    <>
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : null}
                                    {isLoading ? 'Sending...' : 'Send reset link'}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success Message */}
                        {message && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {message}
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        What's next?
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Check your email inbox and spam folder</li>
                                            <li>Click the reset link in the email</li>
                                            <li>Create a new strong password</li>
                                            <li>The link will expire in 1 hour for security</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail('');
                                    setMessage('');
                                    setError('');
                                }}
                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                            >
                                Try with a different email
                            </button>
                        </div>
                    </>
                )}

                <div className="text-center">
                    <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                        ← Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
