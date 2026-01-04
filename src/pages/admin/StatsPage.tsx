import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { adminAPI } from '../../lib/api';

interface ReportItem {
    studentName: string;
    studentEmail: string;
    companyName: string;
    jobTitle: string;
    status: string;
    appliedAt: string;
}

export const StatsPage: React.FC = () => {
    const [report, setReport] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getPlacementReport();
            setReport(data);
        } catch (err: any) {
            console.error('Failed to fetch report:', err);
        } finally {
            setLoading(false);
        }
    }

    const placedStudents = report.filter(item => item.status === 'HIRED');

    const filteredReport = report.filter(item =>
        item.studentName.toLowerCase().includes(search.toLowerCase()) ||
        item.companyName.toLowerCase().includes(search.toLowerCase()) ||
        item.jobTitle.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Placement Activities</h1>
                    <p className="text-muted-foreground mt-1">Tracking all recruitment stages across the platform.</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-2 border-r border-gray-50 text-center">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Actions</div>
                        <div className="text-xl font-bold text-primary">{report.length}</div>
                    </div>
                    <div className="px-4 py-2 text-center">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hires</div>
                        <div className="text-xl font-bold text-green-600">{placedStudents.length}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by student, company or job title..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Job Title</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredReport.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.studentName}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.companyName}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.jobTitle}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(item.appliedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${item.status === 'HIRED' ? 'bg-green-100 text-green-700' :
                                            item.status === 'SHORTLISTED' ? 'bg-purple-100 text-purple-700' :
                                                item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredReport.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                        No placement activities found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
