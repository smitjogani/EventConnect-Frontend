import { Calendar, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
    // Formatting Date
    const dateObj = new Date(event.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const year = dateObj.getFullYear();
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={event.imageUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-black">
                    {event.category || 'Event'}
                </span>

                {/* Date Badge Overlay */}
                <div className="absolute bottom-4 left-4 bg-white text-black p-3 rounded-xl shadow-lg text-center min-w-[60px]">
                    <span className="block text-xl font-bold leading-none">{day}</span>
                    <span className="block text-xs font-medium uppercase text-gray-500">{month}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
                    {event.title}
                </h3>

                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin size={16} />
                        <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={16} />
                        <span>{time} ({year})</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                        <span className="text-xs text-gray-400 uppercase font-medium">Ticket Price</span>
                        <div className="text-lg font-bold">
                            ₹{event.ticketPrice}
                            <span className="text-xs text-gray-400 font-normal ml-1">/ person</span>
                        </div>
                    </div>

                    <Link
                        to={`/events/${event.id}`}
                        className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
