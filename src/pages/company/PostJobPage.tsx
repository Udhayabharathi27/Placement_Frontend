import React, { useState } from 'react';
import { jobAPI } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

export const PostJobPage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await jobAPI.createJob({
                title,
                description,
                requirements,
                location: location || undefined,
                salary: salary || undefined,
            });

            alert('Job Posted Successfully!');
            // Navigate back to jobs page
            navigate('/company/jobs');
        } catch (err: any) {
            setError(err.message || 'Failed to post job');
            console.error('Error posting job:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        placeholder="e.g. Senior React Developer"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description *</label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        placeholder="Job details..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Requirements *</label>
                    <textarea
                        rows={3}
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        placeholder="e.g. 3+ years React experience, TypeScript..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        placeholder="e.g. Remote, New York, Hybrid"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                    <input
                        type="text"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        placeholder="e.g. $80k - $120k"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Posting...' : 'Post Job'}
                </button>
            </form>
        </div>
    );
};
