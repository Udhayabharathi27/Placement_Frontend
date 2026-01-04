const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const getMediaUrl = (path: string) => {
    if (!path) return '';
    return `${BACKEND_URL}${path}`;
};

// Helper to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Helper to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
};

// Auth APIs
export const authAPI = {
    register: async (data: {
        email: string;
        password: string;
        role: 'STUDENT' | 'COMPANY' | 'ADMIN';
        firstName?: string;
        lastName?: string;
        companyName?: string;
    }) => {
        return fetchWithAuth('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    login: async (email: string, password: string) => {
        const response = await fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        // Store token in localStorage
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
        }

        return response;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    },
};

// Job APIs
export const jobAPI = {
    createJob: async (data: {
        title: string;
        description: string;
        requirements: string;
        location?: string;
        salary?: string;
    }) => {
        return fetchWithAuth('/jobs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getAllJobs: async () => {
        return fetchWithAuth('/jobs');
    },

    getMyJobs: async () => {
        return fetchWithAuth('/jobs/my-jobs');
    },

    getJobById: async (id: string) => {
        return fetchWithAuth(`/jobs/${id}`);
    },

    updateJob: async (id: string, data: any) => {
        return fetchWithAuth(`/jobs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteJob: async (id: string) => {
        return fetchWithAuth(`/jobs/${id}`, {
            method: 'DELETE',
        });
    },
};

// Application APIs
export const applicationAPI = {
    applyToJob: async (jobId: string) => {
        return fetchWithAuth('/applications/apply', {
            method: 'POST',
            body: JSON.stringify({ jobId }),
        });
    },

    getMyApplications: async () => {
        return fetchWithAuth('/applications/my-applications');
    },

    getAllCompanyApplications: async () => {
        return fetchWithAuth('/applications/company/all');
    },

    getJobApplications: async (jobId: string) => {
        return fetchWithAuth(`/applications/job/${jobId}`);
    },

    updateApplicationStatus: async (id: string, status: 'APPLIED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED') => {
        return fetchWithAuth(`/applications/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

// Student Profile APIs
export const studentAPI = {
    getMyProfile: async () => {
        return fetchWithAuth('/students/profile');
    },

    updateMyProfile: async (data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        location?: string;
        about?: string;
        university?: string;
        graduationYear?: string;
        skills?: string[];
    }) => {
        return fetchWithAuth('/students/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    uploadResume: async (file: File) => {
        const formData = new FormData();
        formData.append('resume', file);

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/upload/resume`, {
            method: 'POST',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Upload failed' }));
            throw new Error(error.error || 'Upload failed');
        }

        return response.json();
    },
};

// Admin APIs
export const adminAPI = {
    getStats: async () => {
        return fetchWithAuth('/admin/stats');
    },

    getUsers: async () => {
        return fetchWithAuth('/admin/users');
    },

    updateUserStatus: async (id: string, status: 'ACTIVE' | 'BLOCKED' | 'PENDING' | 'REJECTED') => {
        return fetchWithAuth(`/admin/users/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    deleteUser: async (id: string) => {
        return fetchWithAuth(`/admin/users/${id}`, {
            method: 'DELETE',
        });
    },

    getPlacementReport: async () => {
        return fetchWithAuth('/admin/reports/placement');
    },
};

// Analytics APIs
export const analyticsAPI = {
    getStats: async () => {
        return fetchWithAuth('/analytics/stats');
    },
    getStudentStats: async () => {
        return fetchWithAuth('/analytics/student');
    },
    getCompanyStats: async () => {
        return fetchWithAuth('/analytics/company');
    },
};
