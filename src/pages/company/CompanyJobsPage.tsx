import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';
import { jobAPI } from '../../lib/api';

interface Job {
    id: string;
    title: string;
    description: string;
    requirements: string;
    location: string | null;
    salary: string | null;
    status: string;
    createdAt: string;
}

export const CompanyJobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobAPI.getMyJobs();
            setJobs(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load jobs');
            console.error('Error fetching jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (jobId: string, newStatus: string) => {
        try {
            const job = jobs.find(j => j.id === jobId);
            if (!job) return;

            await jobAPI.updateJob(jobId, { ...job, status: newStatus });
            setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
            alert(`Job status updated to ${newStatus}`);
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
            console.error('Error updating status:', err);
        }
    };

    const handleDelete = async (jobId: string) => {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            await jobAPI.deleteJob(jobId);
            setJobs(jobs.filter(job => job.id !== jobId));
            alert('Job deleted successfully');
        } catch (err: any) {
            alert(err.message || 'Failed to delete job');
            console.error('Error deleting job:', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Jobs</h1>
                <div className="text-sm text-gray-600">
                    Total: {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {jobs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                    <p className="text-gray-500 mb-4">Start by posting your first job opening</p>
                    <a
                        href="/company/post-job"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Post a Job
                    </a>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Job Title</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Posted Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">{job.title}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1">{job.description}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {job.location || 'Not specified'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {formatDate(job.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${job.status === 'OPEN'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                                                    title="View Details"
                                                    onClick={() => alert(`Job ID: ${job.id}\n\n${job.description}\n\nRequirements:\n${job.requirements}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>

                                                {job.status === 'OPEN' ? (
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                                                        title="Close Job"
                                                        onClick={() => handleStatusChange(job.id, 'CLOSED')}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                        title="Open Job"
                                                        onClick={() => handleStatusChange(job.id, 'OPEN')}
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                )}

                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                    onClick={() => handleDelete(job.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
