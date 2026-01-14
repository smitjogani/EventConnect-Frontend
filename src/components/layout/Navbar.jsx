import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, User, BookOpen, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Handle scroll for transparency effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        navigate('/');
    };

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent backdrop-blur-sm py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-12">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group relative z-[110]" onClick={() => setIsMenuOpen(false)}>
                            <div className="relative">
                                <span className="font-black text-xl sm:text-2xl tracking-tighter text-white">
                                    EVENT<span className="text-[#00E599]">CONNECT</span>
                                </span>
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00E599] group-hover:w-full transition-all duration-300"></div>
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {/* Show Home and Events only for non-admin users */}
                            {(!user || user.role !== 'ADMIN') && (
                                <>
                                    <Link to="/" className={`text-sm font-bold uppercase tracking-widest hover:text-[#00E599] transition-colors ${scrolled ? 'text-gray-300' : 'text-white'}`}>Home</Link>
                                    <Link to="/events" className={`text-sm font-bold uppercase tracking-widest hover:text-[#00E599] transition-colors ${scrolled ? 'text-gray-300' : 'text-white'}`}>Events</Link>
                                </>
                            )}

                            {user ? (
                                <div className="flex items-center gap-6">
                                    {/* Show My Bookings only for non-admin users */}
                                    {/* {user.role !== 'ADMIN' && (
                                        <Link to="/my-bookings" className={`text-sm font-bold uppercase tracking-widest hover:text-[#00E599] transition-colors ${scrolled ? 'text-gray-300' : 'text-white'}`}>My Bookings</Link>
                                    )} */}
                                    {/* Show Admin link only for admin users */}
                                    {user.role === 'ADMIN' && (
                                        <Link to="/admin" className={`text-sm font-bold uppercase tracking-widest hover:text-[#00E599] transition-colors ${scrolled ? 'text-gray-300' : 'text-white'}`}>Admin Dashboard</Link>
                                    )}
                                    <div className="h-4 w-px bg-white/20"></div>

                                    {/* Profile Dropdown */}
                                    <div className="relative" ref={profileRef}>
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isProfileOpen ? 'bg-[#00E599]/20 text-[#00E599]' : scrolled ? 'text-gray-300 hover:text-[#00E599]' : 'text-white hover:text-[#00E599]'}`}
                                        >
                                            <User size={16} />
                                            <span className="text-sm font-bold uppercase tracking-widest">{user.name}</span>
                                            <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {isProfileOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 mt-2 w-56 bg-black/95 border border-white/10 rounded-xl shadow-xl backdrop-blur-sm overflow-hidden"
                                                >
                                                    {/* Profile Info */}
                                                    <div className="px-4 py-3 border-b border-white/10">
                                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Logged in as</p>
                                                        <p className="text-white font-semibold text-sm">{user.email}</p>
                                                    </div>

                                                    {/* Menu Items */}
                                                    <div className="py-2">
                                                        <Link
                                                            to="/profile"
                                                            onClick={() => setIsProfileOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors text-sm"
                                                        >
                                                            <User size={16} className="text-[#00E599]" />
                                                            <span className="font-medium">Edit Profile</span>
                                                        </Link>

                                                        {user.role !== 'ADMIN' && (
                                                            <Link
                                                                to="/my-bookings"
                                                                onClick={() => setIsProfileOpen(false)}
                                                                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors text-sm"
                                                            >
                                                                <BookOpen size={16} className="text-[#00E599]" />
                                                                <span className="font-medium">My Bookings</span>
                                                            </Link>
                                                        )}

                                                        <div className="border-t border-white/10 my-2"></div>

                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                                                        >
                                                            <LogOut size={16} />
                                                            <span className="font-medium">Logout</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to="/login" className={`text-sm font-bold uppercase tracking-widest hover:text-[#00E599] transition-colors ${scrolled ? 'text-white' : 'text-white'}`}>Log in</Link>
                                    <Link
                                        to="/register"
                                        className="bg-white text-black px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#00E599] transition-all hover:scale-105"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-white hover:text-[#00E599] transition-colors relative z-[110] bg-black/30 rounded-lg"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            type="button"
                        >
                            {isMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-[90] overflow-y-auto"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <div className="min-h-screen pt-32 pb-12 px-8" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-8 flex flex-col items-center">
                                {/* Show Home and Events only for non-admin users */}
                                {(!user || user.role !== 'ADMIN') && (
                                    <>
                                        <Link
                                            to="/"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-3xl font-black uppercase text-white hover:text-[#00E599] transition-colors text-center tracking-tight"
                                        >
                                            Home
                                        </Link>
                                        <Link
                                            to="/events"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-3xl font-black uppercase text-white hover:text-[#00E599] transition-colors text-center tracking-tight"
                                        >
                                            Events
                                        </Link>
                                    </>
                                )}

                                {user ? (
                                    <>
                                        {/* Show My Tickets only for non-admin users */}
                                        {user.role !== 'ADMIN' && (
                                            <Link
                                                to="/my-bookings"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-3xl font-black uppercase text-white hover:text-[#00E599] transition-colors text-center tracking-tight"
                                            >
                                                My Tickets
                                            </Link>
                                        )}
                                        {/* Show Admin Dashboard only for admin users */}
                                        {user.role === 'ADMIN' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-3xl font-black uppercase text-[#00E599] hover:text-white transition-colors text-center tracking-tight"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <div className="w-full max-w-xs mt-12">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full py-4 bg-red-500/10 border-2 border-red-500 text-red-500 rounded-xl font-bold uppercase hover:bg-red-500 hover:text-white transition-all tracking-widest text-lg"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-4 w-full max-w-xs mt-12">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-center py-4 border-2 border-white/20 rounded-xl font-bold uppercase text-white hover:bg-white hover:text-black transition-all tracking-widest text-lg"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-center py-4 bg-[#00E599] text-black rounded-xl font-black uppercase hover:bg-white transition-all tracking-widest shadow-[0_0_20px_rgba(0,229,153,0.4)] text-lg"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
