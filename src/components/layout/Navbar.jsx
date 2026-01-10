import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-black text-white p-1.5 rounded-lg">
                            <Ticket size={24} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">Event Connect</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-gray-600 hover:text-black font-medium transition-colors">Home</Link>
                        <Link to="/events" className="text-gray-600 hover:text-black font-medium transition-colors">Events</Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/my-bookings" className="text-gray-600 hover:text-black font-medium">My Bookings</Link>
                                <div className="h-6 w-px bg-gray-200"></div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-900 font-medium hover:text-gray-700">Log in</Link>
                                <Link
                                    to="/register"
                                    className="bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link to="/" className="block py-3 text-gray-600 font-medium border-b border-gray-50">Home</Link>
                        <Link to="/events" className="block py-3 text-gray-600 font-medium border-b border-gray-50">Explore Events</Link>
                        {user ? (
                            <>
                                <Link to="/my-bookings" className="block py-3 text-gray-600 font-medium border-b border-gray-50">My Tickets</Link>
                                <button onClick={handleLogout} className="block w-full text-left py-3 text-red-600 font-medium">Logout</button>
                            </>
                        ) : (
                            <div className="pt-4 flex flex-col gap-3">
                                <Link to="/login" className="block text-center py-3 border border-gray-200 rounded-xl font-medium">Log in</Link>
                                <Link to="/register" className="block text-center py-3 bg-black text-white rounded-xl font-medium">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
