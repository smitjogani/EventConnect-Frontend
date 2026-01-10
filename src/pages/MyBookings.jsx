import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { myBookings } from '../data/mockBookings';
import Button from '../components/ui/Button';

const StatusBadge = ({ status }) => {
    const styles = {
        CONFIRMED: 'bg-green-100 text-green-800',
        COMPLETED: 'bg-gray-100 text-gray-800',
        CANCELLED: 'bg-red-50 text-red-600',
    };

    return (
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${styles[status] || styles.COMPLETED}`}>
            {status}
        </span>
    );
};

const BoookingRow = ({ booking, index }) => (
    <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
    >
        <td className="py-6 pr-4">
            <div className="w-16 h-16 bg-gray-200 overflow-hidden">
                <img src={booking.event.image} alt="" className="w-full h-full object-cover grayscale" />
            </div>
        </td>
        <td className="py-6 px-4">
            <div className="font-bold text-black">{booking.event.title}</div>
            <div className="text-gray-400 text-xs uppercase mt-1">{booking.id}</div>
        </td>
        <td className="py-6 px-4 whitespace-nowrap text-sm text-gray-600">
            {new Date(booking.event.date).toLocaleDateString()}
        </td>
        <td className="py-6 px-4 whitespace-nowrap text-sm text-gray-600">
            {booking.tickets} x Ticket
        </td>
        <td className="py-6 px-4 whitespace-nowrap font-bold text-black">
            ${booking.totalAmount}
        </td>
        <td className="py-6 pl-4 text-right">
            <StatusBadge status={booking.status} />
        </td>
    </motion.tr>
);

const MyBookings = () => {
    const bookings = useMemo(() => myBookings, []);

    return (
        <div className="min-h-screen pt-32 pb-20 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h1 className="text-5xl font-black text-black mb-2 uppercase tracking-tight">My Bookings</h1>
                        <p className="text-gray-500">Manage your upcoming and past events.</p>
                    </div>
                    <Button to="/" variant="outline">
                        Book New Event
                    </Button>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-gray-200">
                                <th className="pb-4 pr-4 w-20">Image</th>
                                <th className="pb-4 px-4">Event Details</th>
                                <th className="pb-4 px-4">Date</th>
                                <th className="pb-4 px-4">Tickets</th>
                                <th className="pb-4 px-4">Total</th>
                                <th className="pb-4 pl-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <BoookingRow key={booking.id} booking={booking} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
