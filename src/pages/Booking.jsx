import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);

    // Dynamic schema that validates against available seats
    const schema = yup.object({
        name: yup.string().required('Full Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        tickets: yup
            .number()
            .typeError('Must be a number')
            .min(1, 'At least 1 ticket required')
            .max(10, 'Maximum 10 tickets per booking')
            .test('available-seats', 'Not enough seats available', function (value) {
                if (!event || !value) return true;
                return value <= event.availableSeats;
            })
            .required('Ticket count is required'),
    }).required();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            tickets: 1,
            name: user?.name || '',
            email: user?.email || user?.username || ''
        }
    });

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/events/${id}`);
                const eventData = response.data;

                // Check if event date has passed
                const eventDate = new Date(eventData.date);
                const now = new Date();

                if (eventDate < now) {
                    setError('This event has already passed. Bookings are no longer available.');
                    setEvent(null);
                    setLoading(false);
                    return;
                }

                // Check if event is sold out
                if (eventData.availableSeats <= 0) {
                    setError('Sorry, this event is sold out.');
                }

                setEvent(eventData);
            } catch (err) {
                console.error("Error fetching event:", err);
                setError('Failed to load event details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    // Fetch user's IP address and location - SILENT (background only)
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                // Try browser geolocation first
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;

                            try {
                                // Store coordinates directly - avoid CORS issues with reverse geocoding
                                setLocationData({
                                    type: 'geolocation',
                                    latitude,
                                    longitude,
                                    location: `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`
                                });
                            } catch (err) {
                                console.error("Error processing location:", err);
                                setLocationData({
                                    type: 'geolocation',
                                    latitude,
                                    longitude,
                                    location: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
                                });
                            }
                            setLocationLoading(false);
                        },
                        (error) => {
                            console.error("Geolocation error:", error);
                            fetchIPLocationData();
                        }
                    );
                } else {
                    fetchIPLocationData();
                }
            } catch (err) {
                console.error("Error in location setup:", err);
                setLocationLoading(false);
            }
        };

        const fetchIPLocationData = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                // Store meaningful location data
                const locationName = `${data.city || 'City Unknown'}, ${data.region || ''}, ${data.country_name || 'Country Unknown'}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '');

                setLocationData({
                    type: 'ip',
                    ip: data.ip,
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                    location: locationName
                });
            } catch (err) {
                console.error("Error fetching IP location:", err);
                setLocationData({
                    type: 'fallback',
                    location: 'Location detection unavailable'
                });
            }
            setLocationLoading(false);
        };

        fetchLocation();
    }, []);

    // Pre-fill user data if available and not set
    useEffect(() => {
        if (user) {
            setValue('name', user.name || '');
            setValue('email', user.email || user.username || '');
        }
    }, [user, setValue]);

    const ticketCount = watch('tickets') || 0;
    const totalAmount = (ticketCount * (event?.ticketPrice || 0)).toLocaleString('en-IN');

    const onSubmit = async (data) => {
        // Validate location is available
        if (!locationData) {
            setLocationError('Location information is required to book. Please enable location permissions.');
            return;
        }

        setIsProcessing(true);
        try {
            await api.post('/bookings', {
                eventId: Number(id),
                tickets: Number(data.tickets),
                latitude: locationData.latitude,
                longitude: locationData.longitude
            });
            setIsConfirmed(true);
        } catch (err) {
            console.error("Booking failed:", err);

            // Check if it's a validation error about location
            if (err.response?.status === 400) {
                const errorMessage = err.response?.data?.message || err.response?.data || 'Booking failed';

                // Check if error is related to location
                if (errorMessage.toLowerCase().includes('location')) {
                    setLocationError(errorMessage);
                    alert(errorMessage);
                } else {
                    alert(errorMessage);
                }
            } else if (err.response?.status === 401) {
                alert("Please log in to book tickets.");
            } else {
                alert("Booking failed. Please try again.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-white">Loading event details...</div>;
    if (error || !event) return <div className="p-20 text-center text-gray-500">Event not found</div>;

    if (isConfirmed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] text-white">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full text-center bg-[#111] p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,229,153,0.1)]"
                >
                    <div className="w-24 h-24 bg-[#00E599] text-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(0,229,153,0.4)]">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-4xl font-black mb-2 uppercase tracking-tight text-white">Booking Confirmed!</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        You're going to <span className="text-[#00E599] font-bold">{event.title}</span>.
                    </p>

                    <div className="space-y-4">
                        <Link
                            to="/my-bookings"
                            className="w-full bg-white text-black hover:bg-[#00E599] hover:text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center transition-all duration-300"
                        >
                            View My Tickets
                        </Link>
                        <Link
                            to="/events"
                            className="w-full border-2 border-white/20 text-white hover:text-white hover:bg-white/10 hover:border-white font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center transition-all duration-300"
                        >
                            Browse More Events
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#050505] p-6">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 shadow-2xl shadow-black/50 bg-[#111] overflow-hidden rounded-2xl border border-white/10">

                {/* Left: Event Summary (Image) */}
                <div className="relative hidden md:block group">
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-10 text-white">
                        <span className="uppercase tracking-widest text-sm font-bold mb-2 text-[#00E599] drop-shadow-md">Event</span>
                        <h2 className="text-4xl font-black mb-4 leading-none drop-shadow-lg">{event.title}</h2>
                        <div className="flex items-center space-x-6 text-sm font-medium text-gray-300">
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Complete Booking</h2>
                        <p className="text-gray-500">Please fill in your details below.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* We need to adapt the Input component for Dark Mode or override styles here directly if Input is rigid. 
                             Assuming Input accepts className for override or we change standard styles. 
                             The current Input component usually has white stylings. Let's wrap/style carefully. */}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                            <input
                                {...register('name')}
                                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#00E599] focus:outline-none transition-colors"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                {...register('email')}
                                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#00E599] focus:outline-none transition-colors"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Number of Tickets</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                {...register('tickets')}
                                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#00E599] focus:outline-none transition-colors"
                            />
                            {errors.tickets && <p className="text-red-500 text-xs mt-1">{errors.tickets.message}</p>}
                        </div>


                        <div className="pt-8 mt-4 border-t border-white/10">
                            <div className="flex justify-between items-center mb-8 pb-4">
                                <span className="text-gray-500 font-bold uppercase tracking-wide text-sm">Total Amount</span>
                                <span className="text-4xl font-black text-[#00E599]">₹{totalAmount}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing || !locationData}
                                className="w-full uppercase tracking-widest bg-white text-black font-black hover:bg-[#00E599] hover:text-black transition-all duration-300 py-4 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : !locationData ? (
                                    'Waiting for Location...'
                                ) : (
                                    'Confirm & Pay'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};
export default Booking;
