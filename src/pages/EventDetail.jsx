import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { events } from '../data/mockEvents';

const EventDetail = () => {
    const { id } = useParams();
    const event = useMemo(() => events.find(e => e.id === Number(id)), [id]);

    if (!event) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500">
                Event not found
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-6 lg:px-12">

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left: Image & Details */}
                    <div className="lg:w-2/3">
                        <div className="relative aspect-video mb-10 group overflow-hidden">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-0 left-0 bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-sm">
                                {event.category}
                            </div>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black text-black mb-6 uppercase leading-none tracking-tight">
                            {event.title}
                        </h1>

                        <div className="flex flex-col md:flex-row gap-8 mb-10 border-y border-gray-100 py-8">
                            <div>
                                <span className="block text-gray-400 text-sm font-bold uppercase mb-1">Date & Time</span>
                                <span className="text-xl font-bold text-black">
                                    {new Date(event.date).toLocaleDateString(undefined, {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                    })} <br />
                                    <span className="text-gray-500 text-base font-normal">
                                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span className="block text-gray-400 text-sm font-bold uppercase mb-1">Location</span>
                                <span className="text-xl font-bold text-black">{event.location}</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-black mb-4">About Event</h3>
                        <p className="text-gray-600 leading-relaxed text-lg mb-10">
                            {event.description}
                        </p>
                    </div>

                    {/* Right: Booking Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32 p-8 bg-neutral-50 border border-gray-100">
                            <div className="mb-8">
                                <span className="text-gray-500 text-sm uppercase font-bold tracking-widest">Ticket Price</span>
                                <div className="flex items-baseline mt-2">
                                    <span className="text-4xl font-black text-black">${event.price}</span>
                                    <span className="text-gray-400 ml-2">/ per person</span>
                                </div>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-600">Available Seats</span>
                                    <span className="font-bold text-black">{event.availableSeats}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-600">Event Status</span>
                                    <span className="font-bold text-green-600 uppercase text-sm">Selling Fast</span>
                                </div>
                            </div>

                            <Button
                                to={`/booking/${event.id}`}
                                variant="primary"
                                size="lg"
                                className="w-full uppercase tracking-widest text-sm"
                            >
                                Book Ticket Now
                            </Button>

                            <p className="text-center text-xs text-gray-400 mt-4">
                                By booking, you agree to our Terms & Conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
