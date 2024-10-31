'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail({ params }) {
    const [status, setStatus] = useState('verifying');
    const router = useRouter();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`/verifyEmail/${params.token}`);
                const data = await response.json();

                if (data.success) {
                    setStatus('success');
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
            }
        };

        verifyEmail();
    }, [params.token, router]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === 'verifying' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <h2 className="text-2xl font-semibold text-gray-700">Verifying your email...</h2>
                        <p className="text-gray-500">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto">
                            <svg className="w-full h-full text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700">Email Verified!</h2>
                        <p className="text-gray-500">Your email has been successfully verified. Redirecting to login page...</p>
                        <div className="mt-6">
                            <button 
                                onClick={() => router.push('/login')}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto">
                            <svg className="w-full h-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700">Verification Failed</h2>
                        <p className="text-gray-500">The verification link is invalid or has expired.</p>
                        <div className="mt-6">
                            <button 
                                onClick={() => router.push('/login')}
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}