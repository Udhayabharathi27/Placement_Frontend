import React, { useState, useEffect } from 'react';
import { Building2, Briefcase, GraduationCap, Download, Loader2, TrendingUp, ArrowRight } from 'lucide-react';
import { adminAPI } from '../../lib/api';
import { Link } from 'react-router-dom';

interface Stats {
    totalStudents: number;
    totalCompanies: number;
    totalJobs: number;
    totalApplications: number;
    placedStudents: number;
}

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getStats();
            setStats(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        try {
            setExporting(true);
            const data = await adminAPI.getPlacementReport();

            // CSV Generation
            const headers = ['Student Name', 'Email', 'Company', 'Job Title', 'Status', 'Date Applied'];
            const csvContent = [
                headers.join(','),
                ...data.map((row: any) => [
                    `"${row.studentName}"`,
                    `"${row.studentEmail}"`,
                    `"${row.companyName}"`,
                    `"${row.jobTitle}"`,
                    `"${row.status}"`,
                    `"${new Date(row.appliedAt).toLocaleDateString()}"`
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `placement_report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert('Placement report generated successfully!');
        } catch (err: any) {
            alert('Failed to generate report: ' + err.message);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Students",
            value: stats?.totalStudents || 0,
            icon: GraduationCap,
            color: "text-blue-600",
            bg: "bg-blue-50",
            link: "/admin/users"
        },
        {
            title: "Total Companies",
            value: stats?.totalCompanies || 0,
            icon: Building2,
            color: "text-green-600",
            bg: "bg-green-50",
            link: "/admin/users"
        },
        {
            title: "Active Job Stakes",
            value: stats?.totalJobs || 0,
            icon: Briefcase,
            color: "text-purple-600",
            bg: "bg-purple-50",
            link: "/admin/jobs"
        },
        {
            title: "Total Placed",
            value: stats?.placedStudents || 0,
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-50",
            link: "/admin/stats"
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Monitor placement activities</h1>
                    <p className="text-muted-foreground mt-1">Real-time overview of current platform status and recruitment stats.</p>
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={exporting}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {exporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                    Generate placement reports
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{card.value}</h3>
                        </div>
                        <Link to={card.link} className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                            View Details <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Placement Efficiency</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-primary">
                            {stats?.totalStudents ? Math.round((stats.placedStudents / stats.totalStudents) * 100) : 0}%
                        </span>
                        <span className="text-sm text-gray-500 mb-1">Success Rate</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-4">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{ width: `${stats?.totalStudents ? (stats.placedStudents / stats.totalStudents) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Insights</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-500">Applications per Student</span>
                            <span className="font-bold text-gray-900">
                                {stats?.totalStudents ? (stats.totalApplications / stats.totalStudents).toFixed(1) : 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-500">Average Jobs per Company</span>
                            <span className="font-bold text-gray-900">
                                {stats?.totalCompanies ? (stats.totalJobs / stats.totalCompanies).toFixed(1) : 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500">Active Applications</span>
                            <span className="font-bold text-gray-900">{stats?.totalApplications || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
