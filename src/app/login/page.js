"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; 

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleManualLogin = async (e) => {
        e.preventDefault();
        
        // Debugging: cek apakah email dan password diisi
        console.log("Login request with: ", { email, password });

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // Kirim body dalam bentuk JSON
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Login successful');
                router.push('/chat');
            } else {
                setMessage(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('An error occurred');
        }
    };

    const handleGoogleLogin = async () => {
        await signIn('google', { callbackUrl: '/chat' });
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleManualLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
            <hr />
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
}
