import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Upload, Save, FileText, Check } from 'lucide-react';
import { studentAPI, getMediaUrl } from '../../lib/api';

interface ProfileData {
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
    about: string;
    university: string;
    graduationYear: string;
    skills: string[];
    resumeUrl: string | null;
    user: {
        email: string;
    };
}

export const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        location: '',
        about: '',
        skills: '',
        university: '',
        graduationYear: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await studentAPI.getMyProfile();
            setProfile(data);

            // Populate form
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phone: data.phone || '',
                location: data.location || '',
                about: data.about || '',
                skills: data.skills?.join(', ') || '',
                university: data.university || '',
                graduationYear: data.graduationYear || ''
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        try {
            setUploadingResume(true);
            await studentAPI.uploadResume(file);
            alert('Resume uploaded successfully!');
            fetchProfile(); // Refresh profile to get new resumeUrl
        } catch (err: any) {
            alert(err.message || 'Failed to upload resume');
            console.error('Error uploading resume:', err);
        } finally {
            setUploadingResume(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const skillsArray = formData.skills
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            await studentAPI.updateMyProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                location: formData.location,
                about: formData.about,
                skills: skillsArray,
                university: formData.university,
                graduationYear: formData.graduationYear
            });

            alert('Profile saved successfully!');
            fetchProfile(); // Refresh data
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
            console.error('Error saving profile:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Student';
    const initials = `${formData.firstName[0] || 'S'}${formData.lastName[0] || 'T'}`.toUpperCase();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <button
                    type="submit"
                    form="profile-form"
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                {/* ID Card / Quick Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg">
                                <span className="text-4xl font-bold text-primary">{initials}</span>
                            </div>
                            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border hover:bg-gray-50 text-gray-600">
                                <Upload className="h-4 w-4" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold">{fullName}</h2>
                        <p className="text-gray-500 text-sm">Student</p>

                        <div className="w-full mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="truncate">{profile?.user.email}</span>
                            </div>
                            {formData.phone && (
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span>{formData.phone}</span>
                                </div>
                            )}
                            {formData.location && (
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span>{formData.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            Resume
                        </h3>

                        {profile?.resumeUrl ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <div className="bg-green-500 p-1.5 rounded-full">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-green-900 truncate">Resume uploaded</p>
                                        <a
                                            href={getMediaUrl(profile.resumeUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-green-700 hover:underline flex items-center gap-1 mt-0.5"
                                        >
                                            View current resume
                                        </a>
                                    </div>
                                </div>
                                <label className="block w-full">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf"
                                        onChange={handleResumeUpload}
                                        disabled={uploadingResume}
                                    />
                                    <div className="w-full py-2 px-4 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors cursor-pointer text-center flex items-center justify-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        Update Resume
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <label className="block">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleResumeUpload}
                                    disabled={uploadingResume}
                                />
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        {uploadingResume ? (
                                            <div className="h-6 w-6 border-b-2 border-primary rounded-full animate-spin" />
                                        ) : (
                                            <Upload className="h-6 w-6 text-primary" />
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">PDF only, up to 5MB</p>
                                </div>
                            </label>
                        )}
                    </div>
                </div>

                {/* Main Form */}
                <div className="md:col-span-2">
                    <form id="profile-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="pl-9 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="pl-9 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={profile?.user.email || ''}
                                        className="pl-9 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-gray-50"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-9 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="pl-9 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">About Me</label>
                            <textarea
                                name="about"
                                rows={4}
                                value={formData.about}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-semibold mb-4">Education & Skills</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">University</label>
                                    <input
                                        type="text"
                                        name="university"
                                        value={formData.university}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Graduation Year</label>
                                    <input
                                        type="text"
                                        name="graduationYear"
                                        value={formData.graduationYear}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="e.g. React, TypeScript, Node.js, Python, Tailwind CSS"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
