import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TicketUI from '../components/ui/TicketUI';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings/my-bookings');
                setBookings(response.data);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Helper to calculate total price if backend doesn't return it
    // Assuming structure: { eventTitle, eventDate, eventLocation, tickets, eventPrice, ... }
    const getPrice = (booking) => {
        // Fallback calculation if totalPrice not in DTO
        if (booking.totalPrice) return booking.totalPrice;
        // If eventPrice is available
        if (booking.eventPrice) return booking.eventPrice * booking.tickets;
        return 0;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">My Tickets</h1>
                    <p className="text-gray-400 text-lg">Manage all your upcoming and past events here.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                        {bookings.map((booking) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={booking.id}
                                className="group"
                            >
                                <TicketUI variant="dark" className="h-full hover:-translate-y-1 transition-transform duration-300">
                                    <div className="flex flex-col md:flex-row gap-6">

                                        {/* Left: Date/Time */}
                                        <div className="md:w-32 flex-shrink-0 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 text-center md:text-right">
                                            <span className="text-4xl font-black text-[#00E599]">
                                                {new Date(booking.eventDate).getDate()}
                                            </span>
                                            <span className="text-xl font-bold uppercase tracking-widest text-white">
                                                {new Date(booking.eventDate).toLocaleDateString(undefined, { month: 'short' })}
                                            </span>
                                            <span className="text-xs font-mono text-gray-500 mt-2">
                                                {new Date(booking.eventDate).getFullYear()}
                                            </span>
                                        </div>

                                        {/* Right: Info */}
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-2xl font-bold uppercase leading-tight group-hover:text-[#00E599] transition-colors line-clamp-2">
                                                        {booking.eventTitle}
                                                    </h3>
                                                    <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ml-2 whitespace-nowrap">
                                                        Confirmed
                                                    </span>
                                                </div>

                                                <div className="space-y-2 mt-4">
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                                        <Clock size={16} className="text-[#00E599]" />
                                                        {new Date(booking.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                                                        <MapPin size={16} className="text-[#00E599]" />
                                                        {booking.eventLocation}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-end">
                                                <div>
                                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Quantity</div>
                                                    <div className="text-lg font-bold text-white flex items-center gap-2">
                                                        <Ticket size={18} /> {booking.tickets} Ticket{booking.tickets > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Paid</div>
                                                    <div className="text-2xl font-black text-[#00E599]">
                                                        {booking.totalAmount
                                                            ? `₹${booking.totalAmount.toLocaleString('en-IN')}`
                                                            : '₹0'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </TicketUI>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#111] rounded-2xl p-12 text-center border border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Ticket size={32} className="text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold uppercase mb-4">No Bookings Yet</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            You haven't booked any events yet. Check out our upcoming events and grab your tickets!
                        </p>
                        <Link to="/events" className="inline-block bg-[#00E599] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-all">
                            Browse Events
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
