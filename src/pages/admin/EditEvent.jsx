import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon, IndianRupee, Users, Type } from 'lucide-react';
import api from '../../services/api';

// Validation Schema
const schema = yup.object({
    title: yup.string()
        .required('Event title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must not exceed 100 characters'),
    description: yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must not exceed 2000 characters'),
    date: yup.string()
        .required('Date and time is required')
        .test('is-future', 'Event date must be in the future', function (value) {
            if (!value) return false;
            const selectedDate = new Date(value);
            const now = new Date();
            return selectedDate > now;
        }),
    location: yup.string()
        .required('Location is required')
        .min(3, 'Location must be at least 3 characters'),
    category: yup.string().required('Category is required'),
    ticketPrice: yup.number()
        .typeError('Price must be a number')
        .min(0, 'Price cannot be negative')
        .max(1000000, 'Price seems unreasonably high')
        .required('Price is required'),
    capacity: yup.number()
        .typeError('Capacity must be a number')
        .positive('Capacity must be positive')
        .integer('Capacity must be a whole number')
        .min(1, 'Capacity must be at least 1')
        .max(100000, 'Capacity seems unreasonably high')
        .required('Capacity is required'),
    availableSeats: yup.number()
        .typeError('Available seats must be a number')
        .min(0, 'Available seats cannot be negative')
        .integer('Available seats must be a whole number')
        .test('not-exceed-capacity', 'Available seats cannot exceed capacity', function (value) {
            const { capacity } = this.parent;
            if (value === undefined || capacity === undefined) return true;
            return value <= capacity;
        })
        .required('Available seats is required'),
    imageUrl: yup.string()
        .url('Must be a valid URL')
        .required('Image URL is required'),
}).required();

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                const event = response.data;

                // Populate form with existing data
                setValue('title', event.title);
                setValue('description', event.description);
                setValue('date', new Date(event.date).toISOString().slice(0, 16)); // Format for datetime-local
                setValue('location', event.location);
                setValue('category', event.category);
                setValue('ticketPrice', event.ticketPrice);
                setValue('capacity', event.capacity);
                setValue('availableSeats', event.availableSeats);
                setValue('imageUrl', event.imageUrl);
                setPreviewImage(event.imageUrl);
            } catch (err) {
                console.error("Failed to fetch event", err);
                alert("Failed to load event. Redirecting to dashboard.");
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, navigate, setValue]);

    const imageUrl = watch('imageUrl');
    if (imageUrl && imageUrl !== previewImage) {
        setPreviewImage(imageUrl);
    }

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                date: new Date(data.date).toISOString().slice(0, 19)
            };

            await api.put(`/events/${id}`, payload);
            navigate('/admin');
        } catch (err) {
            console.error("Failed to update event", err);
            alert("Failed to update event. Please check your inputs.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link to="/admin" className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Edit Event</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Form */}
                    <div className="lg:col-span-2 bg-[#111] p-6 sm:p-8 rounded-2xl border border-white/10">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Event Title</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        {...register('title')}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00E599]"
                                        placeholder="e.g. Neon Dreams Music Festival"
                                    />
                                </div>
                                <p className="text-red-500 text-xs">{errors.title?.message}</p>
                            </div>

                            {/* Category & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                                    <select
                                        {...register('category')}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00E599] appearance-none"
                                    >
                                        <option value="Music">Music</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Art">Art</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Workshop">Workshop</option>
                                    </select>
                                    <p className="text-red-500 text-xs">{errors.category?.message}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Date & Time</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="datetime-local"
                                            {...register('date')}
                                            className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00E599]"
                                            style={{ colorScheme: 'dark' }}
                                        />
                                    </div>
                                    <p className="text-red-500 text-xs">{errors.date?.message}</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        {...register('location')}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00E599]"
                                        placeholder="e.g. Downtown Arena, New York"
                                    />
                                </div>
                                <p className="text-red-500 text-xs">{errors.location?.message}</p>
                            </div>

                            {/* Price, Capacity & Available Seats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Ticket Price (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('ticketPrice')}
                                            className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00E599]"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <p className="text-red-500 text-xs">{errors.ticketPrice?.message}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Capacity</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            {...register('capacity')}
                                            className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00E599]"
                                            placeholder="e.g. 500"
                                        />
                                    </div>
                                    <p className="text-red-500 text-xs">{errors.capacity?.message}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Available</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            {...register('availableSeats')}
                                            className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00E599]"
                                            placeholder="e.g. 450"
                                        />
                                    </div>
                                    <p className="text-red-500 text-xs">{errors.availableSeats?.message}</p>
                                </div>
                            </div>

                            {/* Image URL */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Cover Image URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        {...register('imageUrl')}
                                        className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#00E599]"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <p className="text-red-500 text-xs">{errors.imageUrl?.message}</p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows="5"
                                    className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#00E599] resize-none"
                                    placeholder="Tell people about your event..."
                                ></textarea>
                                <p className="text-red-500 text-xs">{errors.description?.message}</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#00E599] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center"
                            >
                                {isSubmitting ? 'Updating Event...' : 'Update Event'}
                            </button>

                        </form>
                    </div>

                    {/* Right: Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="h-48 bg-gray-900 w-full relative">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 uppercase font-bold text-xs tracking-widest">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Preview</div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <div className="text-[#00E599] text-xs font-bold uppercase tracking-widest">
                                        {watch('category') || 'Category'}
                                    </div>
                                    <h3 className="text-xl font-black leading-tight">
                                        {watch('title') || 'Event Title'}
                                    </h3>
                                </div>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-[#00E599]" />
                                        <span>{watch('date') ? new Date(watch('date')).toLocaleDateString() : 'Date'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-[#00E599]" />
                                        <span className="truncate">{watch('location') || 'Location'}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Price</span>
                                    <span className="text-xl font-black text-[#00E599]">₹{watch('ticketPrice') || '0'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
