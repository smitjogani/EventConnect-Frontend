import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { events } from '../data/mockEvents';
import { Link } from 'react-router-dom';

const TrendingCategory = ({ title, image, className }) => (
    <div className={`relative group overflow-hidden rounded-none ${className}`}>
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75 group-hover:brightness-90" />
        <div className="absolute bottom-6 left-6 text-white z-10">
            <h3 className="text-2xl font-bold mb-1">{title}</h3>
        </div>
        <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-black/30 backdrop-blur-md border border-white text-white px-4 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors flex items-center">
                Preview <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
        </div>
    </div>
);

const EventCard = ({ event }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white group cursor-pointer"
    >
        <div className="relative h-64 overflow-hidden mb-4 rounded-none">
            <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-sm">
                {event.category}
            </div>
        </div>
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <span className="text-violet-600 font-bold text-sm uppercase tracking-wide">
                    {new Date(event.date).toLocaleDateString()}
                </span>
                <span className="text-gray-500 text-xs line-through">$300</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-2 leading-tight group-hover:underline decoration-2 underline-offset-4">
                {event.title}
            </h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {event.description}
            </p>

            <div className="mt-auto">
                <Link to={`/events/${event.id}`} className="text-sm font-bold text-black border-b-2 border-black pb-0.5 hover:text-violet-600 hover:border-violet-600 transition-colors">
                    Get Tickets &rarr;
                </Link>
            </div>
        </div>
    </motion.div>
);

const Home = () => {
    const featuredEvents = useMemo(() => events, []);

    return (
        <div className="min-h-screen pt-24 pb-20">

            {/* Hero Section */}
            <div className="container mx-auto px-6 lg:px-12 mb-32">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4"
                        >
                            <p className="text-gray-500 text-lg mb-2">All the fun starts here.</p>
                            <h1 className="text-6xl md:text-8xl font-bold text-black leading-[0.9] tracking-tight mb-8">
                                Book your <br />
                                Tickets for <br />
                                <span className="border-b-8 border-gray-200">Event!</span>
                            </h1>
                        </motion.div>

                        <ul className="space-y-3 mb-10 text-gray-600 font-medium">
                            <li className="flex items-center"><span className="w-2 h-2 bg-black rounded-full mr-3"></span>Safe, Secure, Reliable ticketing.</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-black rounded-full mr-3"></span>Your ticket to live entertainment!</li>
                        </ul>

                        <Button to="/events" size="lg" className="rounded-none px-10">
                            Explore Events
                        </Button>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <img src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=600&q=80" className="w-full h-64 object-cover rounded-none" alt="Concert" />
                                <img src="https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=600&q=80" className="w-full h-40 object-cover rounded-none" alt="DJ" />
                            </div>
                            <div className="space-y-4">
                                <img src="https://images.unsplash.com/photo-1459749411177-0473ef71607b?w=600&q=80" className="w-full h-48 object-cover rounded-none" alt="Lights" />
                                <img src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80" className="w-full h-64 object-cover rounded-none" alt="Crowd" />
                            </div>
                        </div>
                        {/* Decorative Elements */}
                        <svg className="absolute -top-10 right-0 w-32 h-32 text-gray-200 opacity-50 z-[-1]" viewBox="0 0 100 100" fill="currentColor">
                            <path d="M0 50 L50 0 L100 50 L50 100 Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Trending Categories Section */}
            <section className="bg-neutral-50 py-20">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-2">Trending categories</h2>
                        <p className="text-gray-500">Be sure not to miss these Events today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
                        <TrendingCategory
                            title="Fashion"
                            image="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                            className="h-full"
                        />
                        <div className="grid grid-cols-1 gap-6">
                            <TrendingCategory
                                title="Music"
                                image="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80"
                                className="h-full"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 h-[300px]">
                        <TrendingCategory
                            title="Lifestyle"
                            image="https://images.unsplash.com/photo-1544367563-12123d896889?w=800&q=80"
                            className="h-full"
                        />
                        <TrendingCategory
                            title="Art"
                            image="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"
                            className="h-full"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 overflow-hidden relative">
                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="mb-20">
                        <h2 className="text-4xl font-bold mb-2">How it works</h2>
                        <p className="text-gray-500">Lorem ipsum text</p>
                    </div>

                    <div className="space-y-24">
                        {/* Step 1 */}
                        <div className="flex flex-col md:flex-row items-center gap-12 relative">
                            <div className="md:w-1/2 relative">
                                <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80" className="w-full max-w-md ml-auto rounded-none shadow-xl shadow-gray-200" alt="Step 1" />
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white flex items-center justify-center shadow-lg border border-gray-100">
                                    <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <span className="text-sm font-bold text-gray-400 mb-2 block">Step 1</span>
                                <h3 className="text-3xl font-bold mb-4">Choose an event you want to be part with</h3>
                                <p className="text-gray-500 leading-relaxed max-w-md">Lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                            </div>
                            {/* Dashed line */}
                            <div className="hidden md:block absolute top-[80%] left-[40%] w-64 h-32 border-b-2 border-r-2 border-dashed border-gray-300 rounded-br-[4rem] -z-10"></div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12 relative">
                            <div className="md:w-1/2 relative">
                                <img src="https://images.unsplash.com/photo-1549451371-64d411a36bb1?w=800&q=80" className="w-full max-w-md mr-auto rounded-none shadow-xl shadow-gray-200" alt="Step 2" />
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white flex items-center justify-center shadow-lg border border-gray-100">
                                    <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <span className="text-sm font-bold text-gray-400 mb-2 block">Step 2</span>
                                <h3 className="text-3xl font-bold mb-4">Live unique experience</h3>
                                <p className="text-gray-500 leading-relaxed max-w-md">Lorem ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.</p>
                            </div>
                            {/* Dashed line */}
                            <div className="hidden md:block absolute top-[80%] right-[40%] w-64 h-32 border-b-2 border-l-2 border-dashed border-gray-300 rounded-bl-[4rem] -z-10"></div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2 relative">
                                <img src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80" className="w-full max-w-md ml-auto rounded-none shadow-xl shadow-gray-200" alt="Step 3" />
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white flex items-center justify-center shadow-lg border border-gray-100">
                                    <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <span className="text-sm font-bold text-gray-400 mb-2 block">Step 3</span>
                                <h3 className="text-3xl font-bold mb-4">Get access to private perks</h3>
                                <p className="text-gray-500 leading-relaxed max-w-md">Lorem ipsum simply dummy text of the printing and typesetting industry.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Events */}
            <div className="container mx-auto px-6 lg:px-12 pb-20">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold mb-2 text-black">Featured Events</h2>
                        <p className="text-gray-500">Be sure not to miss these Event today.</p>
                    </div>

                    <div className="hidden md:flex space-x-2">
                        <button className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                            &larr;
                        </button>
                        <button className="w-10 h-10 border border-black bg-black text-white flex items-center justify-center">
                            &rarr;
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {featuredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
