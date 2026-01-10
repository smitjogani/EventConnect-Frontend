import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Ticket, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 9;

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                // Prepare params
                const params = {
                    page: page,
                    size: pageSize,
                    keyword: keyword || undefined, // Don't send empty string
                    // category: category || undefined // Backend doesn't seem to have category filter in Controller yet, but let's check
                };

                // Note: The Controller (EventController.java) seen earlier supports: page, size, sortBy, keyword.
                // It does NOT explicitly show a 'category' param in the snippet provided.
                // However, I will implement client-side category filtering OR basic keyword implementation for now.
                // Ideally, backend should support category filtering.

                const response = await api.get('/events', { params });

                let fetchedEvents = [];
                let total = 0;

                if (Array.isArray(response.data)) {
                    // Raw Array (as seen in user screenshot)
                    fetchedEvents = response.data;
                    total = 1; // Cannot determine total pages from flat list
                    setTotalPages(1);
                } else if (response.data.content) {
                    // Standard Spring Data Page
                    fetchedEvents = response.data.content;
                    total = response.data.totalPages;
                    setTotalPages(response.data.totalPages);
                } else if (response.data.events) {
                    // Custom Service Map
                    fetchedEvents = response.data.events;
                    total = response.data.totalPages;
                    setTotalPages(response.data.totalPages);
                }

                if (fetchedEvents.length > 0) {
                    // Client-side filtering as fallback
                    if (category) {
                        fetchedEvents = fetchedEvents.filter(e => e.category === category);
                    }
                    setEvents(fetchedEvents);
                } else {
                    setEvents([]);
                    setTotalPages(0);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [keyword, category, page]);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [keyword, category]);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-20">
            {/* Header / Filter Bar */}
            <div className="border-b border-white/10 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-black mb-8">Explore Events</h1>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, artist, or venue..."
                                className="w-full bg-[#111] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#00E599] transition-colors"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                className="w-full bg-[#111] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white appearance-none focus:outline-none focus:border-[#00E599] transition-colors"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Music">Music</option>
                                <option value="Conference">Conference</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Sports">Sports</option>
                                <option value="Art">Art</option>
                                <option value="Technology">Technology</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : events.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map(event => (
                                <div key={event.id} className="group block bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-transparent hover:shadow-[0_0_30px_rgba(0,229,153,0.15)] transition-all duration-300 relative flex flex-col h-full">
                                    {/* Image */}
                                    <div className="h-64 overflow-hidden relative">
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'; }}
                                        />
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm border border-white/10">
                                            {event.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-[#00E599] transition-colors">{event.title}</h3>

                                        <div className="space-y-3 mb-6 flex-grow">
                                            <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                                                <Calendar size={16} className="text-[#00E599]" />
                                                <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                                                <MapPin size={16} className="text-[#00E599]" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                                                <Ticket size={16} className="text-[#00E599]" />
                                                <span>{event.availableSeats} seats left</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-auto">
                                            <div className="text-xl font-black text-white">₹{event.ticketPrice.toLocaleString('en-IN')}</div>

                                            <Link to={`/events/${event.id}`} className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#00E599] transition-colors flex items-center gap-2">
                                                Get Ticket <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-16 flex justify-center items-center gap-6">
                            <button
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                                className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-lg font-bold uppercase disabled:opacity-30 hover:bg-[#00E599] hover:text-black hover:border-transparent transition-all"
                            >
                                <ChevronLeft size={20} /> Previous
                            </button>

                            <span className="font-mono text-gray-400 font-bold">
                                Page <span className="text-white">{page + 1}</span> of <span className="text-white">{totalPages || 1}</span>
                            </span>

                            <button
                                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                disabled={page >= totalPages - 1}
                                className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-lg font-bold uppercase disabled:opacity-30 hover:bg-[#00E599] hover:text-black hover:border-transparent transition-all"
                            >
                                Next <ChevronRight size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-[#111] rounded-2xl border border-dashed border-white/10">
                        <h3 className="text-2xl font-bold mb-2">No Events Found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
