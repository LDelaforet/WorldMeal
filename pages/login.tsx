import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const ok = await login(email, password);
        if (ok) {
            router.push('/profile');
        } else {
            setError('Invalid credentials. Use demo@worldmeal.test / demo1234');
        }
    };

    const loginDemo = async () => {
        setError(null);
        const ok = await login('demo@worldmeal.test', 'demo1234');
        if (ok) router.push('/profile');
        else setError('Demo login failed');
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Header currentPage="profile" />
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Login</h1>
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-sm"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base active:scale-95 transform"
                            >
                                Login
                            </button>

                            {error && (
                                <p className="mt-3 text-xs sm:text-sm text-red-600 text-center">{error}</p>
                            )}

                            <button
                                type="button"
                                onClick={loginDemo}
                                className="w-full mt-3 border border-gray-300 text-gray-900 font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base active:scale-95 transform"
                            >
                                Login as Demo
                            </button>
                        </form>

                        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-primary hover:text-secondary font-semibold">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
