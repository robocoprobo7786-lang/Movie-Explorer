import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const success = login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-xl">
                <h1 className="mb-6 text-3xl font-bold text-slate-50 text-center">Welcome Back</h1>
                
                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-slate-50 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                            placeholder="demo@movieexplorer.com"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-slate-50 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
                    >
                        Sign In
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-slate-400">
                    <p>Demo credentials:</p>
                    <p>Email: <span className="text-slate-300">demo@movieexplorer.com</span></p>
                    <p>Password: <span className="text-slate-300">password123</span></p>
                </div>
            </div>
        </div>
    );
}
