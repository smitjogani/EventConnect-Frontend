import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff, AlertCircle, CheckCircle, User, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Profile form state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Validate inputs
            if (formData.name.length < 2 || formData.name.length > 100) {
                setMessageType('error');
                setMessage('Name must be between 2 and 100 characters');
                setLoading(false);
                return;
            }

            if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                setMessageType('error');
                setMessage('Please enter a valid email address');
                setLoading(false);
                return;
            }

            const response = await api.put('/users/profile', {
                name: formData.name,
                email: formData.email
            });

            setMessageType('success');
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessageType('error');
            setMessage(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Validate inputs
            if (!passwordForm.currentPassword) {
                setMessageType('error');
                setMessage('Please enter your current password');
                setLoading(false);
                return;
            }

            if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
                setMessageType('error');
                setMessage('New password must be at least 6 characters');
                setLoading(false);
                return;
            }

            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setMessageType('error');
                setMessage('New password and confirm password do not match');
                setLoading(false);
                return;
            }

            const response = await api.post('/users/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword
            });

            setMessageType('success');
            setMessage('Password changed successfully!');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessageType('error');
            setMessage(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00E599] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={28} className="text-white" />
                    </button>
                    <h1 className="text-5xl font-black uppercase text-white tracking-tight">
                        My <span className="text-[#00E599]">Profile</span>
                    </h1>
                </div>

                {/* Message Alert */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mb-8 p-4 rounded-xl flex items-center gap-3 border ${
                            messageType === 'success'
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {messageType === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        <span className="text-sm font-bold">{message}</span>
                    </motion.div>
                )}

                {/* Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Tabs */}
                    <div className="flex border-b border-white/10 bg-black/40">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 px-8 py-4 font-bold uppercase text-sm tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${
                                activeTab === 'profile'
                                    ? 'border-[#00E599] text-[#00E599] bg-[#00E599]/5'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            <User size={18} />
                            Edit Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex-1 px-8 py-4 font-bold uppercase text-sm tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${
                                activeTab === 'password'
                                    ? 'border-[#00E599] text-[#00E599] bg-[#00E599]/5'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            <Lock size={18} />
                            Change Password
                        </button>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={updateProfile}
                            className="p-10 space-y-8"
                        >
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#00E599] flex items-center gap-2">
                                    <User size={16} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00E599] transition-colors"
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.name.length}/100 characters
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#00E599] flex items-center gap-2">
                                    <Mail size={16} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleProfileChange}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00E599] transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#00E599] text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-10 text-lg"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={changePassword}
                            className="p-10 space-y-8"
                        >
                            {/* Current Password */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#00E599] flex items-center gap-2">
                                    <Lock size={16} /> Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter current password"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00E599] transition-colors pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#00E599] flex items-center gap-2">
                                    <Lock size={16} /> New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password (min 6 characters)"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00E599] transition-colors pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#00E599] flex items-center gap-2">
                                    <Lock size={16} /> Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00E599] transition-colors pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#00E599] text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-10 text-lg"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Change Password
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}