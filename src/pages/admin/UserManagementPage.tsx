import React, { useState, useEffect } from 'react';
import { Check, X, Shield, Search, ShieldAlert, Trash2 } from 'lucide-react';
import { adminAPI } from '../../lib/api';

interface User {
    id: string;
    email: string;
    role: 'STUDENT' | 'COMPANY' | 'ADMIN';
    status: 'ACTIVE' | 'BLOCKED' | 'PENDING' | 'REJECTED';
    createdAt: string;
    studentProfile?: {
        firstName: string;
        lastName: string;
    };
    companyProfile?: {
        companyName: string;
    };
}

export const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId: string, newStatus: User['status']) => {
        try {
            await adminAPI.updateUserStatus(userId, newStatus);
            setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
            alert(`User status updated to ${newStatus}`);
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            alert('User deleted successfully');
        } catch (err: any) {
            alert(err.message || 'Failed to delete user');
        }
    };

    const getUserName = (user: User) => {
        if (user.role === 'STUDENT' && user.studentProfile) {
            return `${user.studentProfile.firstName} ${user.studentProfile.lastName}`;
        }
        if (user.role === 'COMPANY' && user.companyProfile) {
            return user.companyProfile.companyName;
        }
        return 'Admin User';
    };

    const filteredUsers = users.filter(user => {
        const matchesFilter = filter === 'ALL' || user.role === filter;
        const name = getUserName(user).toLowerCase();
        const email = user.email.toLowerCase();
        const matchesSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage accounts, approve companies, or block users.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-[300px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="flex gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
                {['ALL', 'STUDENT', 'COMPANY', 'ADMIN'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${filter === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}s
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                {getUserName(user).charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{getUserName(user)}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium capitalize
                                            ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' :
                                                user.role === 'COMPANY' ? 'bg-blue-50 text-blue-700' :
                                                    'bg-green-50 text-green-700'}`}>
                                            {user.role.toLowerCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                user.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    user.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                            {user.status === 'ACTIVE' && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                                            {user.status === 'PENDING' && <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />}
                                            {user.status === 'REJECTED' && <div className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(user.id, 'REJECTED')}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                            {user.status === 'ACTIVE' && user.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => handleStatusChange(user.id, 'BLOCKED')}
                                                    className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Block"
                                                >
                                                    <ShieldAlert className="h-4 w-4" />
                                                </button>
                                            )}
                                            {user.status === 'BLOCKED' && (
                                                <button
                                                    onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Unblock/Reactivate"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                </button>
                                            )}
                                            {user.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
