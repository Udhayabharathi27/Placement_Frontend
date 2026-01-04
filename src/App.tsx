import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Dashboards
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ProfilePage } from './pages/student/ProfilePage';
import { JobsPage } from './pages/student/JobsPage';
import { ApplicationsPage } from './pages/student/ApplicationsPage';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { PostJobPage } from './pages/company/PostJobPage';
import { CompanyJobsPage } from './pages/company/CompanyJobsPage';
import { CompanyCandidatesPage } from './pages/company/CompanyCandidatesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AllJobsPage } from './pages/admin/AllJobsPage';
import { StatsPage } from './pages/admin/StatsPage';

const App: React.FC = () => {
    return (
        <Router />
    );
};

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes - Wrapped in MainLayout */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Protected Dashboard Routes - Wrapped in DashboardLayout */}
                    <Route element={<DashboardLayout />}>
                        {/* Student Routes */}
                        <Route
                            path="/student/*"
                            element={
                                <ProtectedRoute allowedRoles={['student']}>
                                    <Routes>
                                        <Route path="dashboard" element={<StudentDashboard />} />
                                        <Route path="profile" element={<ProfilePage />} />
                                        <Route path="jobs" element={<JobsPage />} />
                                        <Route path="applications" element={<ApplicationsPage />} />
                                        {/* Add other student routes here */}
                                        <Route path="*" element={<Navigate to="dashboard" />} />
                                    </Routes>
                                </ProtectedRoute>
                            }
                        />

                        {/* Company Routes */}
                        <Route
                            path="/company/*"
                            element={
                                <ProtectedRoute allowedRoles={['company']}>
                                    <Routes>
                                        <Route path="dashboard" element={<CompanyDashboard />} />
                                        <Route path="post-job" element={<PostJobPage />} />
                                        <Route path="jobs" element={<CompanyJobsPage />} />
                                        <Route path="candidates" element={<CompanyCandidatesPage />} />
                                        {/* Add other company routes here */}
                                        <Route path="*" element={<Navigate to="dashboard" />} />
                                    </Routes>
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/*"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <Routes>
                                        <Route path="dashboard" element={<AdminDashboard />} />
                                        <Route path="users" element={<UserManagementPage />} />
                                        <Route path="jobs" element={<AllJobsPage />} />
                                        <Route path="stats" element={<StatsPage />} />
                                        {/* Add other admin routes here */}
                                        <Route path="*" element={<Navigate to="dashboard" />} />
                                    </Routes>
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
