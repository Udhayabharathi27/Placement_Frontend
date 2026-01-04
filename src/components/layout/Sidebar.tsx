import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    UserCircle,
    Briefcase,
    FileText,
    Users,
    PlusCircle,
    ListChecks,
    BarChart3,
    LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    const getNavItems = () => {
        switch (user?.role) {
            case 'student':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/student/dashboard' },
                    { icon: UserCircle, label: 'Profile', path: '/student/profile' },
                    { icon: Briefcase, label: 'Jobs', path: '/student/jobs' },
                    { icon: FileText, label: 'My Applications', path: '/student/applications' },
                ];
            case 'company':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/company/dashboard' },
                    { icon: PlusCircle, label: 'Post Job', path: '/company/post-job' },
                    { icon: Briefcase, label: 'My Jobs', path: '/company/jobs' },
                    { icon: Users, label: 'Candidates', path: '/company/candidates' },
                ];
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
                    { icon: Users, label: 'User Management', path: '/admin/users' },
                    { icon: Briefcase, label: 'All Jobs', path: '/admin/jobs' },
                    { icon: BarChart3, label: 'Statistics', path: '/admin/stats' }, // Fixed path from /stats to /admin/stats for consistency
                ];
            default:
                return [];
        }
    };

    return (
        <div className="h-screen w-64 bg-slate-900 text-white fixed left-0 top-0 flex flex-col transition-all duration-300">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold">
                        P
                    </div>
                    <span className="text-xl font-bold tracking-tight">Portal</span>
                </div>
                <div className="mt-4 flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-800/50">
                    <img
                        src={user?.avatar}
                        alt="Profile"
                        className="h-8 w-8 rounded-full border border-slate-700"
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {getNavItems().map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};
