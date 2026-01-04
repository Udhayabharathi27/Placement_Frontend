import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import { jobAPI, applicationAPI } from '../../lib/api';

interface Job {
    id: string;
    title: string;
    description: string;
    requirements: string;
    location: string | null;
    salary: string | null;
    status: string;
    createdAt: string;
    company: {
        companyName: string;
    };
}

export const JobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const [jobsData, appsData] = await Promise.all([
                jobAPI.getAllJobs(),
                applicationAPI.getMyApplications()
            ]);
            setJobs(jobsData);

            // Extract job IDs from user's applications
            const appliedIds = new Set(appsData.map((app: any) => app.jobId));
            setAppliedJobIds(appliedIds as Set<string>);
        } catch (err: any) {
            setError(err.message || 'Failed to load jobs');
            console.error('Error fetching jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId: string) => {
        try {
            setApplyingJobId(jobId);
            await applicationAPI.applyToJob(jobId);
            setAppliedJobIds(prev => new Set(prev).add(jobId));
            alert('Application submitted successfully!');
        } catch (err: any) {
            alert(err.message || 'Failed to apply for job');
            console.error('Error applying:', err);
        } finally {
            setApplyingJobId(null);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return '1 day ago';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return `${Math.floor(diffInDays / 30)} months ago`;
    };

    const getCompanyInitials = (companyName: string) => {
        return companyName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const filteredJobs = jobs.filter(job =>
        job.status === 'OPEN' && (
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Browse Jobs</h1>
                    <p className="text-muted-foreground mt-1">Find your next career opportunity</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-white border px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-50">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 shadow-md shadow-primary/20">
                        Saved Jobs
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search for jobs, companies, or keywords..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Job Count */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4" />
                <span>{filteredJobs.length} jobs available</span>
            </div>

            {/* Job List */}
            <div className="grid gap-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-xl shadow-sm bg-primary/10 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-primary">
                                            {getCompanyInitials(job.company.companyName)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-grow space-y-4">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                            <p className="text-gray-600 font-medium">{job.company.companyName}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                Full-time
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                {job.status}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                                        {job.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4" />
                                                {job.location}
                                            </div>
                                        )}
                                        {job.salary && (
                                            <div className="flex items-center gap-1.5">
                                                <DollarSign className="h-4 w-4" />
                                                {job.salary}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            {getTimeAgo(job.createdAt)}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex gap-2 flex-wrap">
                                            {job.requirements.split(',').slice(0, 3).map((skill, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleApply(job.id)}
                                            disabled={applyingJobId === job.id || appliedJobIds.has(job.id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${appliedJobIds.has(job.id)
                                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                                                    : 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed'
                                                }`}
                                        >
                                            {applyingJobId === job.id ? 'Applying...' : appliedJobIds.has(job.id) ? 'Applied' : 'Apply Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'Try adjusting your search' : 'No jobs have been posted yet'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
