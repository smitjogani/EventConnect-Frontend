import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';
import TicketUI from '../components/ui/TicketUI';
import QRCode from 'react-qr-code';

export default function TicketReceipt() {
    const { id } = useParams(); // Booking ID
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true);
            try {
                // Assuming we can fetch a single booking details by ID
                // Backend controller: @GetMapping("/{id}") public ResponseEntity<BookingResponseDto> getBookingById(...)
                const response = await api.get(`/bookings/${id}`);
                setBooking(response.data);
            } catch (err) {
                console.error("Failed to fetch booking:", err);
                setError("Ticket not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error || !booking) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Ticket Not Found</h2>
                <Link to="/my-bookings" className="text-[#00E599] hover:underline">Back to My Bookings</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 flex items-center justify-center px-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-4xl w-full"
            >
                <div className="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">E-Ticket Receipt</h1>
                        <p className="text-gray-400 text-sm">Present this digital ticket at the venue entrance.</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Link to="/my-bookings" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                            &larr; Back to All Tickets
                        </Link>
                    </div>
                </div>

                <TicketUI variant="dark" className="p-0 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Left: Event Details */}
                        <div className="p-8 md:p-12 flex-grow bg-gradient-to-br from-[#151515] to-[#0a0a0a]">
                            <div className="flex items-start justify-between mb-8">
                                <div className="space-y-1">
                                    <span className="inline-block bg-[#00E599] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                                        Confirmed
                                    </span>
                                    <h2 className="text-3xl md:text-5xl font-black uppercase leading-none text-white w-full max-w-lg">
                                        {booking.eventTitle}
                                    </h2>
                                </div>
                                <div className="hidden md:block text-right">
                                    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Booking Ref</div>
                                    <div className="font-mono text-xl text-[#00E599] tracking-widest">#{booking.bookingId.toString().padStart(6, '0')}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <Calendar className="text-[#00E599] mt-1" size={24} />
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Date</div>
                                            <div className="text-lg font-bold">{new Date(booking.eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Clock className="text-[#00E599] mt-1" size={24} />
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Time</div>
                                            <div className="text-lg font-bold">{new Date(booking.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="text-[#00E599] mt-1" size={24} />
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Location</div>
                                            <div className="text-lg font-bold">{booking.eventLocation}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Ticket className="text-[#00E599] mt-1" size={24} />
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Tickets</div>
                                            <div className="text-lg font-bold">{booking.tickets} Person{booking.tickets > 1 ? 's' : ''}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Ordered on {new Date(booking.bookingDate).toLocaleDateString()}
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Paid</div>
                                    <div className="text-3xl font-black text-white">
                                        {booking.totalAmount
                                            ? `₹${booking.totalAmount.toLocaleString('en-IN')}`
                                            : '₹0'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: QR Code / Stub */}
                        <div className="bg-white text-black p-8 md:w-80 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-gray-300 relative">
                            {/* Decorative cutouts */}
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#050505] rounded-full"></div>
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#050505] rounded-full"></div>

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-black uppercase mb-1">Scan Entry</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Admit One</p>
                            </div>

                            <div className="p-4 bg-white border-4 border-black rounded-lg mb-6">
                                <QRCode
                                    value={`BOOKING-${booking.bookingId}-${booking.eventTitle}`}
                                    size={150}
                                />
                            </div>

                            <div className="text-center text-xs font-mono text-gray-500 uppercase">
                                <div>ID: {booking.bookingId}</div>
                                <div className="mt-1">Powered by EventConnect</div>
                            </div>
                        </div>
                    </div>
                </TicketUI>

            </motion.div>
        </div>
    );
}
