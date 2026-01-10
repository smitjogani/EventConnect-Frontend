import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Admin Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 h-16 sm:h-20 flex items-center px-4 sm:px-8 justify-between">
                <div className="flex items-center gap-3 sm:gap-4 cursor-default">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00E599] rounded-lg rotate-3 flex items-center justify-center text-black font-black text-lg sm:text-xl">
                        A
                    </div>
                    <div>
                        <h1 className="text-base sm:text-xl font-black uppercase tracking-tighter text-white">EventConnect Admin</h1>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest hidden sm:block">Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider hidden md:block">
                        {user?.name || user?.email || 'Admin'}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} className="sm:w-6 sm:h-6" />
                        <span className="hidden sm:inline text-sm font-bold uppercase tracking-widest">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16 sm:pt-20">
                {children}
            </main>
        </div>
    );
}
