"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail({ params }) {
    const [status, setStatus] = useState('verifying');
    const router = useRouter();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`/api/auth/verifyEmail/${params.token}`);
                const data = await response.json();

                if (data.success) {
                    setStatus('success');
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
        <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                {status === 'verifying' && (
                    <div>
                        <img src="/emailverifycat.png" alt="Loading" className="w-20 h-20 mx-auto animate-spin" />
                        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Verifying your email...</h2>
                        <p className="text-gray-500">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <img src="/emailverifycat.png" alt="Verified" className="w-24 h-24 mx-auto" />
                        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Your Email Has Been Verified!</h2>
                        <p className="text-gray-500">Thank you for verifying your email. You can now log in to your account.</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-pink-500 text-white px-6 py-2 rounded-md mt-6 hover:bg-pink-600 transition ease-in-out duration-200"
                        >
                            Go to Login 
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <img src="/emailverifycat.png" alt="Error" className="w-20 h-20 mx-auto" />
                        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Verification Failed</h2>
                        <p className="text-gray-500">The verification link is invalid or has expired.</p>
                        <button 
                            onClick={() => router.push('/login')}
                            className="bg-pink-500 text-white px-6 py-2 rounded-md mt-6 hover:bg-pink-600 transition ease-in-out duration-200"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
