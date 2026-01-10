import { useState, useEffect } from 'react';
import { Search, ArrowRight, Play, Star, Calendar, MapPin, Ticket, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '../services/api'; // Import API
import TicketUI from '../components/ui/TicketUI';

export default function Home() {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const rotateTicket = useTransform(scrollYProgress, [0, 0.5], [10, -10]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch top 3 events (sorted by date by default in backend)
                const response = await api.get('/events?page=0&size=3');
                // Backend returns Map<String, Object>, check structure. 
                // If it returns standard pagination: { content: [...] }
                let eventsData = [];
                if (Array.isArray(response.data)) {
                    eventsData = response.data;
                } else if (response.data.content) {
                    eventsData = response.data.content;
                } else if (response.data.events) {
                    eventsData = response.data.events;
                }
                setFeaturedEvents(eventsData.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };
        fetchEvents();
    }, []);

    const marqueeText = " • BOOK YOUR TICKETS • NO HIDDEN FEES • INSTANT ACCESS • LIVE EXPERIENCES • SECURE PAYMENTS •";

    return (
        <div className="bg-[#050505] text-white overflow-x-hidden selection:bg-[#00E599] selection:text-black font-sans">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Graphics */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#00E599] rounded-full blur-[200px] opacity-10 animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900 rounded-full blur-[150px] opacity-10"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-dashed border-white/10 rounded-full animate-spin-slow"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
                    {/* Left: Content */}
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#00E599]">Live Events</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 sm:mb-8 leading-[0.9] tracking-tighter">
                                UNLEASH <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00E599] via-green-400 to-emerald-600">THE HYPE.</span>
                            </h1>

                            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                                The world's most immersive booking platform. Secure tickets for concerts, festivals, and VIP experiences in seconds.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                                <Link to="/events" className="group relative overflow-hidden bg-[#00E599] text-black px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform duration-300 text-center text-sm sm:text-base">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Grab Tickets <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                    </span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: 3D Ticket Stack Visualization */}
                    <div className="relative hidden lg:flex justify-center items-center h-[600px]">
                        <motion.div
                            className="absolute z-30"
                            initial={{ y: 200, opacity: 0, rotate: 10 }}
                            animate={{ y: 0, opacity: 1, rotate: 10 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ rotate: rotateTicket }}
                        >
                            <TicketUI variant="green" className="w-[450px] shadow-[0_30px_60px_rgba(0,229,153,0.3)] hover:scale-105 transition-transform cursor-pointer">
                                <div className="border-b border-black/10 pb-4 mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-4xl font-black uppercase leading-none">Weeknd Live</h3>
                                        <Zap size={24} fill="black" />
                                    </div>
                                    <p className="font-mono text-sm uppercase opacity-70 font-bold tracking-widest">Global Tour • LA</p>
                                </div>
                                <div className="flex justify-between items-end mt-auto">
                                    <div className="font-mono text-xs font-bold leading-relaxed opacity-70">
                                        DATE: OCT 24 <br />
                                        GATE: 04 ROW: A
                                    </div>
                                    <div className="text-5xl font-black tracking-tighter">₹24,000</div>
                                </div>
                            </TicketUI>
                        </motion.div>

                        <motion.div
                            className="absolute z-20 top-[20%]"
                            initial={{ opacity: 0, rotate: -5 }}
                            animate={{ opacity: 1, rotate: -5 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <TicketUI variant="white" className="w-[450px] opacity-60 scale-95">
                                <div className="p-2 opacity-50">
                                    <h3 className="text-3xl font-black uppercase">Coachella</h3>
                                    <p className="font-mono text-sm">3 DAY PASS</p>
                                </div>
                            </TicketUI>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-bounce">
                    <span className="text-xs font-bold uppercase tracking-widest">Scroll</span>
                    <ArrowRight size={16} className="rotate-90" />
                </div>
            </section>

            {/* --- MARQUEE SECTION (From User Request) --- */}
            <div className="bg-[#00E599] border-y-4 border-black/20 overflow-hidden py-5 rotate-1 max-w-[105vw] -ml-[2vw] shadow-2xl relative z-20 transform scale-110">
                <div className="animate-marquee flex gap-12">
                    {Array(8).fill(marqueeText).map((text, i) => (
                        <span key={i} className="text-3xl md:text-4xl font-black text-black uppercase tracking-widest flex-shrink-0 italic">
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            {/* --- FEATURED EVENTS GRID --- */}
            <section className="py-20 sm:py-32 bg-[#050505] relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mobile: Centered */}
                    <div className="text-center md:hidden mb-16">
                        <span className="text-[#00E599] font-bold uppercase tracking-widest text-xs mb-3 block">Don't Miss Out</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9] mb-6">
                            TRENDING<br />EVENTS
                        </h2>
                        <Link to="/events" className="inline-flex items-center gap-2 border-b-2 border-white pb-1 font-bold uppercase tracking-widest text-sm hover:text-[#00E599] hover:border-[#00E599] transition-colors group">
                            View Full Schedule <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Desktop: Left-Right Split */}
                    <div className="hidden md:flex justify-between items-end mb-20 gap-8">
                        <div>
                            <span className="text-[#00E599] font-bold uppercase tracking-widest text-sm mb-2 block">Don't Miss Out</span>
                            <h2 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[0.9]">
                                TRENDING<br />EVENTS
                            </h2>
                        </div>
                        <Link to="/events" className="group flex items-center gap-2 border-b-2 border-white pb-1 font-bold uppercase tracking-widest hover:text-[#00E599] hover:border-[#00E599] transition-colors whitespace-nowrap">
                            View Full Schedule <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
                        {featuredEvents.map((event, i) => (
                            <Link to={`/events/${event.id}`} key={event.id} className="group block relative">
                                {/* Image Container with Hover Effect */}
                                <div className="h-[400px] overflow-hidden relative rounded-xl mb-6">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img
                                        src={event.imageUrl}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        alt={event.title}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'; }}
                                    />

                                    {/* Category Tag */}
                                    <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur text-black px-4 py-1.5 font-black text-xs uppercase tracking-widest">
                                        {event.category}
                                    </div>

                                    {/* Date Tag */}
                                    <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur text-white p-3 text-center min-w-[60px] rounded-lg border border-white/10">
                                        <div className="text-xl font-black leading-none">{new Date(event.date).getDate()}</div>
                                        <div className="text-[10px] font-bold uppercase text-gray-400">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-3xl font-black mb-2 leading-none group-hover:text-[#00E599] transition-colors uppercase relative inline-block">
                                        {event.title}
                                        <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#00E599] group-hover:w-full transition-all duration-300"></div>
                                    </h3>

                                    <div className="flex justify-between items-end mt-4 border-t border-white/10 pt-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                                <MapPin size={16} /> {event.location.split(',')[0]}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                                <Ticket size={16} /> {event.availableSeats} Remaining
                                            </div>
                                        </div>
                                        <div className="text-3xl font-black text-[#00E599]">₹{event.ticketPrice}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter mix-blend-difference">
                        READY TO <br /> <span className="text-stroke-2 text-transparent bg-clip-text bg-none" style={{ WebkitTextStroke: '2px #00E599' }}>EXPERIENCE?</span>
                    </h2>
                    <p className="text-gray-400 text-xl font-medium mb-12 max-w-2xl mx-auto">
                        Join thousands of fans who book seamlessly with Event Connect. Secure your spot at the biggest events of the year.
                    </p>
                    <Link to="/events" className="inline-block bg-[#00E599] text-black text-xl font-black px-12 py-6 uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(0,229,153,0.4)]">
                        Get Started Now
                    </Link>
                </div>
            </section>

        </div>
    );
}
