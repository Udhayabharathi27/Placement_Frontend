import React, { useState, useEffect } from 'react';
import { Briefcase, Eye, Trash2, Building2, MapPin, DollarSign, Calendar } from 'lucide-react';
import { jobAPI } from '../../lib/api';

interface Job {
    id: string;
    title: string;
    description: string;
    location: string | null;
    salary: string | null;
    status: 'OPEN' | 'CLOSED';
    createdAt: string;
    company: {
        companyName: string;
    };
}

export const AllJobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobAPI.getAllJobs();
            setJobs(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        if (!window.confirm('Are you sure you want to delete this job posting? This will also remove associated applications.')) return;
        try {
            await jobAPI.deleteJob(jobId);
            setJobs(jobs.filter(j => j.id !== jobId));
            alert('Job deleted successfully');
        } catch (err: any) {
            alert(err.message || 'Failed to delete job');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage all job postings</h1>
                <p className="text-muted-foreground mt-1">Review and manage all jobs published across the platform.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid gap-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1.5 font-medium text-gray-700">
                                        <Building2 className="h-4 w-4" />
                                        {job.company.companyName}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" />
                                        {job.location || 'Remote'}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <DollarSign className="h-4 w-4" />
                                        {job.salary || 'Competitive'}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2 max-w-3xl mb-4">{job.description}</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <button
                                    onClick={() => alert('View Details Mode: No dedicated admin view for this yet.')}
                                    className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors border border-transparent hover:border-primary/10"
                                    title="View Full Post"
                                >
                                    <Eye className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                    title="Delete Job"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {jobs.length === 0 && (
                    <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900">No job postings found</h3>
                        <p className="text-gray-500">There are no jobs currently listed on the platform.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
