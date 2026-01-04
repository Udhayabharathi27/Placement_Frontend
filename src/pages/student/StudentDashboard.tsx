import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../lib/api';
import { FileText, CheckCircle2, XCircle, Briefcase, Clock, ExternalLink } from 'lucide-react';

interface StudentStats {
    totalApplied: number;
    hiredCount: number;
    shortlistedCount: number;
    rejectedCount: number;
    recentApplications: any[];
}

export const StudentDashboard: React.FC = () => {
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await analyticsAPI.getStudentStats();
                setStats(data);
            } catch (err: any) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const statCards = [
        { title: "Total Applications", value: stats?.totalApplied || 0, color: "bg-blue-500", icon: FileText },
        { title: "Shortlisted", value: stats?.shortlistedCount || 0, color: "bg-purple-500", icon: CheckCircle2 },
        { title: "Offers Received", value: stats?.hiredCount || 0, color: "bg-green-500", icon: ExternalLink },
        { title: "Rejected", value: stats?.rejectedCount || 0, color: "bg-red-500", icon: XCircle },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                <p className="text-muted-foreground mt-1">Track your job applications and progress</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => (
                    <div key={i} className="rounded-xl border bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <span className="text-sm font-medium text-gray-600">{stat.title}</span>
                            <stat.icon className={`h-5 w-5 ${stat.color.replace('bg-', 'text-')} opacity-80`} />
                        </div>
                        <div className="text-3xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-1 md:col-span-4 rounded-xl border bg-white shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Applications
                    </h2>
                    <div className="space-y-4">
                        {stats?.recentApplications && stats.recentApplications.length > 0 ? (
                            stats.recentApplications.map((app: any) => (
                                <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                                            {app.job.company.companyName[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{app.job.title}</p>
                                            <p className="text-xs text-gray-500">{app.job.company.companyName}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${app.status === 'HIRED' ? 'bg-green-100 text-green-700' :
                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            app.status === 'SHORTLISTED' ? 'bg-purple-100 text-purple-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-slate-50 rounded-lg border-2 border-dashed border-gray-200">
                                <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                <p>No applications yet</p>
                                <a href="/student/jobs" className="text-primary text-sm hover:underline mt-2 inline-block">Browse available jobs</a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-1 md:col-span-3 rounded-xl border bg-white shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Next Steps
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                            <h3 className="font-medium text-primary text-sm">Complete your profile</h3>
                            <p className="text-xs text-gray-600 mt-1">A complete profile increases your chances of getting shortlisted by 60%.</p>
                            <a href="/student/profile" className="text-primary text-xs font-semibold mt-2 inline-block hover:underline">Update Profile →</a>
                        </div>
                        <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                            <h3 className="font-medium text-orange-700 text-sm">Upload your resume</h3>
                            <p className="text-xs text-orange-600 mt-1">Make sure your latest resume is uploaded to your profile.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
