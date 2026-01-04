import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, XCircle, User, Briefcase, Calendar, FileText } from 'lucide-react';
import { applicationAPI } from '../../lib/api';

interface Application {
    id: string;
    status: string;
    appliedAt: string;
    job: {
        title: string;
        description: string;
    };
    student: {
        firstName: string;
        lastName: string;
        resumeUrl: string | null;
        user: {
            email: string;
        };
    };
}

export const CompanyCandidatesPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await applicationAPI.getAllCompanyApplications();
            setApplications(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load applications');
            console.error('Error fetching applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId: string, status: 'SHORTLISTED' | 'REJECTED' | 'HIRED') => {
        try {
            setUpdatingId(applicationId);
            await applicationAPI.updateApplicationStatus(applicationId, status);

            // Update local state
            setApplications(applications.map(app =>
                app.id === applicationId ? { ...app, status } : app
            ));

            alert(`Application ${status.toLowerCase()} successfully!`);
        } catch (err: any) {
            alert(err.message || 'Failed to update application status');
            console.error('Error updating status:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPLIED': return 'bg-blue-100 text-blue-800';
            case 'SHORTLISTED': return 'bg-purple-100 text-purple-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'HIRED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading candidates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
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
                        <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500">Applications from students will appear here</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {applications.map((application) => (
                        <div key={application.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-lg font-bold text-primary">
                                            {getInitials(application.student.firstName, application.student.lastName)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {application.student.firstName} {application.student.lastName}
                                        </h3>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Briefcase className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">Applied for <span className="font-medium text-gray-900">{application.job.title}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Mail className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">{application.student.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                                <span>Applied on {formatDate(application.appliedAt)}</span>
                                            </div>

                                            {application.student.resumeUrl && (
                                                <div className="mt-2">
                                                    <a
                                                        href={`http://localhost:5000${application.student.resumeUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md hover:bg-primary/20 transition-colors"
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        View Resume
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                                    <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                        {application.status}
                                    </span>

                                    {application.status === 'APPLIED' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(application.id, 'SHORTLISTED')}
                                                disabled={updatingId === application.id}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                Shortlist
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                                                disabled={updatingId === application.id}
                                                className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {application.status === 'SHORTLISTED' && (
                                        <button
                                            onClick={() => handleStatusUpdate(application.id, 'HIRED')}
                                            disabled={updatingId === application.id}
                                            className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Mark as Hired
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
