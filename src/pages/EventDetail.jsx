import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Share2, ArrowLeft, Check, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import TicketUI from '../components/ui/TicketUI';

export default function EventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);
            } catch (err) {
                console.error("Error fetching event:", err);
                setError("Event not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Event Not Found</h2>
                    <Link to="/events" className="text-[#00E599] hover:underline">Back to Events</Link>
                </div>
            </div>
        );
    }

    const totalPrice = event.ticketPrice * ticketCount;
    // Calculate GST if applicable, assuming ticketPrice is base.
    const gst = totalPrice * 0.18;
    const finalAmount = totalPrice + gst;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00E599] selection:text-black pt-20">

            {/* --- HERO BANNER --- */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10"></div>

                {/* Image Background */}
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'; }}
                />

                <div className="absolute top-8 left-4 md:left-8 z-20">
                    <Link to="/events" className="flex items-center gap-2 text-white/80 hover:text-white bg-black/40 px-4 py-2 rounded-full backdrop-blur transition-all hover:bg-black/60">
                        <ArrowLeft size={18} /> Back to Events
                    </Link>
                </div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute bottom-0 left-0 w-full z-20 p-4 md:p-12 max-w-7xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-block bg-[#00E599] text-black font-black text-xs px-3 py-1 uppercase tracking-widest mb-4">
                                {event.category}
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black uppercase leading-none mb-4 max-w-4xl text-white drop-shadow-lg">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-gray-300 font-medium text-lg">
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-[#00E599]" size={20} />
                                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="text-[#00E599]" size={20} />
                                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-[#00E599]" size={20} />
                                    {event.location}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                <Share2 size={20} /> Share Event
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- CONTENT SECTION --- */}
            <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-16">

                {/* Left: Description */}
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-wide mb-6 border-l-4 border-[#00E599] pl-4">About Event</h2>
                        <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-line">
                            {event.description}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-wide mb-6 border-l-4 border-[#00E599] pl-4">Venue Map</h2>
                        <div className="bg-[#111] h-80 w-full rounded-xl overflow-hidden border border-white/5 relative">
                            {/* Google Maps Embed (No API Key needed for basic embed) */}
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                className="filter grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity duration-300"
                            ></iframe>
                            {/* Overlay to intercept clicks if needed, or style it */}
                            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1 rounded text-xs font-bold text-[#00E599] pointer-events-none">
                                LIVE MAP
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Booking Card (Sticky) */}
                <div className="relative">
                    <div className="sticky top-24">
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E599] blur-[80px] opacity-20 pointer-events-none"></div>

                            <div className="mb-6">
                                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Price per ticket</span>
                                <div className="text-4xl font-black text-white mt-1">
                                    ₹{event.ticketPrice.toLocaleString('en-IN')}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Ticket Counter */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Select Tickets</label>
                                    <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-lg p-2">
                                        <button
                                            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                            className="w-10 h-10 flex items-center justify-center bg-[#222] rounded hover:bg-[#333] transition-colors font-bold text-xl"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-bold">{ticketCount}</span>
                                        <button
                                            onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                                            className="w-10 h-10 flex items-center justify-center bg-[#00E599] text-black rounded hover:bg-[#00c985] transition-colors font-bold text-xl"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-black/30 rounded-lg p-4 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>GST (18%)</span>
                                        <span>₹{gst.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white text-lg">
                                        <span>Total</span>
                                        <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <Link to={`/booking/${event.id}`} className="block w-full bg-[#00E599] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white hover:scale-[1.02] transition-all text-center">
                                    Proceed to Pay
                                </Link>

                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                                    <Check size={14} className="text-green-500" /> Secure Payments
                                </div>
                            </div>
                        </div>

                        {/* Mini Ticket Preview */}
                        <div className="mt-8 opacity-80 scale-95">
                            <TicketUI variant="dark">
                                <div className="border-b border-white/10 pb-4 mb-4">
                                    <h3 className="text-xl font-bold uppercase truncate">{event.title}</h3>
                                    <p className="font-mono text-xs opacity-60 uppercase">{event.location}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="font-mono text-xs opacity-60">ADMIT {ticketCount}</div>
                                    <div className="text-2xl font-black">₹{finalAmount.toLocaleString('en-IN')}</div>
                                </div>
                            </TicketUI>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
