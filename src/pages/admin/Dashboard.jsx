import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Calendar, Edit, Trash2, LogOut } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function AdminDashboard() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, eventId: null, eventTitle: '' });

    // Fetch Events for Management
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events?size=100');
                if (response.data.content) {
                    setEvents(response.data.content);
                } else if (response.data.events) {
                    setEvents(response.data.events);
                } else if (Array.isArray(response.data)) {
                    setEvents(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch events", err);
                setError("Failed to load events.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openDeleteModal = (id, title) => {
        setDeleteModal({ isOpen: true, eventId: id, eventTitle: title });
    };

    const confirmDelete = async () => {
        setDeleteModal({ ...deleteModal, isOpen: false });
        try {
            await api.delete(`/events/${deleteModal.eventId}`);
            setEvents(events.filter(e => e.id !== deleteModal.eventId));
            alert('Event deleted successfully!');
        } catch (err) {
            console.error("Delete failed", err);
            const errorMessage = err.response?.data?.message || err.message;

            // Check if it's a constraint violation (bookings exist)
            if (errorMessage.includes('constraint') || errorMessage.includes('Duplicate') || err.response?.status === 400) {
                alert('Cannot delete this event because it has existing bookings. Please cancel all bookings first or contact support.');
            } else if (err.response?.status === 403) {
                alert('You do not have permission to delete this event.');
            } else {
                alert(`Failed to delete event: ${errorMessage}`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            {/* Admin Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 h-16 sm:h-20 flex items-center px-4 sm:px-8 justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00E599] rounded-lg rotate-3 flex items-center justify-center text-black font-black text-lg sm:text-xl">
                        A
                    </div>
                    <div>
                        <h1 className="text-base sm:text-xl font-black uppercase tracking-tighter">EventConnect Admin</h1>
                        <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest hidden sm:block">Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider hidden md:block">
                        {user?.name || user?.email || 'Admin'}
                    </span>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                        <LogOut size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 sm:pt-32 px-4 sm:px-8 pb-12 max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-12 gap-4 sm:gap-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2">Manage Events</h2>
                        <p className="text-sm sm:text-base text-gray-400">View, create, and manage all platform events.</p>
                    </div>
                    <Link to="/admin/events/new" className="w-full md:w-auto bg-[#00E599] text-black font-black uppercase tracking-widest px-4 sm:px-6 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors text-sm sm:text-base">
                        <Plus size={18} className="stroke-[3px]" />
                        Create New Event
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading events...</div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500 font-bold">{error}</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl font-bold mb-4">No events yet</p>
                        <p className="text-sm">Create your first event to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {/* Table Header - Hidden on mobile */}
                        <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest px-6 pb-2 border-b border-white/10 hidden lg:grid">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-5">Event Details</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Price</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#111] p-4 sm:p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group"
                            >
                                {/* Mobile/Tablet Layout */}
                                <div className="lg:hidden space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={event.imageUrl} alt={event.title} loading="lazy" className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-gray-500">#{index + 1}</span>
                                                <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-[#00E599] transition-colors truncate">
                                                    {event.title}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2 truncate">{event.location}</p>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                                                <Calendar size={12} className="text-[#00E599]" />
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                        <span className="text-lg sm:text-xl font-black text-[#00E599]">₹{event.ticketPrice}</span>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/admin/events/edit/${event.id}`}
                                                className="w-10 h-10 bg-white/5 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                                                title="Edit Event"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => openDeleteModal(event.id, event.title)}
                                                className="w-10 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                                                title="Delete Event"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Layout */}
                                <div className="hidden lg:contents">
                                    <div className="col-span-1 text-gray-500 font-mono text-xs">#{index + 1}</div>
                                    <div className="col-span-5 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'; }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-[#00E599] transition-colors truncate">
                                                {event.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 truncate">{event.location}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-sm font-medium text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-[#00E599]" />
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="col-span-2 font-bold text-[#00E599]">
                                        ₹{event.ticketPrice}
                                    </div>
                                    <div className="col-span-2 flex items-center justify-end gap-3">
                                        <Link
                                            to={`/admin/events/edit/${event.id}`}
                                            className="w-10 h-10 bg-white/5 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                                            title="Edit Event"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(event.id, event.title)}
                                            className="w-10 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                                            title="Delete Event"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, eventId: null, eventTitle: '' })}
                onConfirm={confirmDelete}
                title="Delete Event?"
                message={`Are you sure you want to delete "${deleteModal.eventTitle}"? This action cannot be undone and all associated bookings will be affected.`}
                confirmText="Delete Event"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
}
