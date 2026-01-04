import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { authAPI } from '../lib/api';

export const RegisterPage: React.FC = () => {
    const [role, setRole] = useState<UserRole>('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare registration data based on role
            const registrationData: any = {
                email,
                password,
                role: role.toUpperCase() as 'STUDENT' | 'COMPANY' | 'ADMIN',
            };

            if (role === 'student') {
                // Split name into first and last name
                const nameParts = name.trim().split(' ');
                registrationData.firstName = nameParts[0] || name;
                registrationData.lastName = nameParts.slice(1).join(' ') || nameParts[0];
            } else if (role === 'company') {
                registrationData.companyName = name;
            }

            // Register user
            await authAPI.register(registrationData);

            if (role === 'company') {
                alert('Registration successful! Your account is pending admin approval.');
                navigate('/login');
                return;
            }

            // Auto-login after successful registration (for students)
            const loginResponse = await authAPI.login(email, password);
            login(loginResponse.user, loginResponse.token);

            const userRole = loginResponse.user.role.toLowerCase() as UserRole;

            // Navigate to dashboard
            navigate(`/${userRole}/dashboard`);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join our placement portal
                    </p>
                </div>

                <div className="flex justify-center gap-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${role === 'student' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('company')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${role === 'company' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Company
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder={role === 'student' ? 'Full Name' : 'Company Name'}
                            />
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password (min 6 characters)"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="font-medium text-primary hover:text-primary/80"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
