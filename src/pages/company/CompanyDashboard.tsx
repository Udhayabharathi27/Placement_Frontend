import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../lib/api';
import { Briefcase, Users, CheckCircle2, TrendingUp, Clock, ArrowRight, User } from 'lucide-react';

interface CompanyStats {
    totalJobs: number;
    openJobs: number;
    totalApps: number;
    hiredCount: number;
    shortlistedCount: number;
    recentApplications: any[];
}

export const CompanyDashboard: React.FC = () => {
    const [stats, setStats] = useState<CompanyStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await analyticsAPI.getCompanyStats();
                setStats(data);
            } catch (err: any) {
                console.error('Failed to load company stats:', err);
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
        { title: "Active Jobs", value: stats?.openJobs || 0, color: "text-blue-600", bg: "bg-blue-50", icon: Briefcase },
        { title: "Total Applicants", value: stats?.totalApps || 0, color: "text-indigo-600", bg: "bg-indigo-50", icon: Users },
        { title: "Shortlisted", value: stats?.shortlistedCount || 0, color: "text-purple-600", bg: "bg-purple-50", icon: CheckCircle2 },
        { title: "Hired", value: stats?.hiredCount || 0, color: "text-green-600", bg: "bg-green-50", icon: TrendingUp },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Company Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage your recruitment process and track performance</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} p-2.5 rounded-lg`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-medium text-gray-400">Total</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm font-medium text-gray-500 mt-1">{stat.title}</div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Applications */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Recent Candidates
                        </h2>
                        <a href="/company/candidates" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                            View all
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {stats?.recentApplications && stats.recentApplications.length > 0 ? (
                                stats.recentApplications.map((app: any) => (
                                    <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {app.student.firstName[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                                    {app.student.firstName} {app.student.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">Applied for <span className="font-medium">{app.job.title}</span></p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'HIRED' ? 'bg-green-100 text-green-700' :
                                                app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    app.status === 'SHORTLISTED' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-blue-100 text-blue-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
                                    <User className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No recent candidates found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Hiring Progress */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        <a href="/company/jobs/new" className="p-4 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-between group">
                            <div>
                                <h3 className="font-bold">Post a New Job</h3>
                                <p className="text-xs text-white/80 mt-0.5">Reach thousands of talented students</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                <Briefcase className="h-5 w-5" />
                            </div>
                        </a>
                        <a href="/company/jobs" className="p-4 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-between group">
                            <div>
                                <h3 className="font-bold">Manage Job Openings</h3>
                                <p className="text-xs text-white/80 mt-0.5">Edit, close or delete active postings</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                <Clock className="h-5 w-5" />
                            </div>
                        </a>
                        <div className="p-6 rounded-xl bg-indigo-50 border border-indigo-100">
                            <h3 className="font-bold text-indigo-900">Hiring Tip</h3>
                            <p className="text-sm text-indigo-700 mt-2 italic">"Shortlisting candidates within 48 hours increases your hiring success rate by 40%."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
