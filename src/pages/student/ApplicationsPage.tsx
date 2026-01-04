import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, XCircle, Building2, Briefcase } from 'lucide-react';
import { applicationAPI } from '../../lib/api';

interface Application {
    id: string;
    status: string;
    appliedAt: string;
    job: {
        title: string;
        company: {
            companyName: string;
        };
    };
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'APPLIED': return 'bg-blue-100 text-blue-800';
        case 'SHORTLISTED': return 'bg-purple-100 text-purple-800';
        case 'REJECTED': return 'bg-red-100 text-red-800';
        case 'HIRED': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'APPLIED': return <Clock className="h-4 w-4" />;
        case 'SHORTLISTED': return <CheckCircle2 className="h-4 w-4" />;
        case 'REJECTED': return <XCircle className="h-4 w-4" />;
        case 'HIRED': return <CheckCircle2 className="h-4 w-4" />;
        default: return null;
    }
};

export const ApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await applicationAPI.getMyApplications();
            setApplications(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load applications');
            console.error('Error fetching applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCompanyInitials = (companyName: string) => {
        return companyName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
                <div className="text-sm text-gray-600">
                    Total: {applications.length} application{applications.length !== 1 ? 's' : ''}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {applications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Briefcase className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-4">Start applying to jobs to track your applications here</p>
                    <a
                        href="/student/jobs"
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Browse Jobs
                    </a>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Company & Role</th>
                                    <th className="px-6 py-4">Applied Date</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shadow-sm">
                                                    <span className="text-sm font-bold text-primary">
                                                        {getCompanyInitials(app.job.company.companyName)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{app.job.title}</div>
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                        <Building2 className="h-3 w-3" />
                                                        {app.job.company.companyName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(app.appliedAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status}
                                            </span>
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
