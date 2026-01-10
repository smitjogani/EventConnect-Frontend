import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { events } from '../data/mockEvents';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const schema = yup.object({
    name: yup.string().required('Full Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    tickets: yup
        .number()
        .typeError('Must be a number')
        .min(1, 'At least 1 ticket')
        .max(5, 'Max 5 tickets')
        .required('Ticket count is required'),
}).required();

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const event = useMemo(() => events.find(e => e.id === Number(id)), [id]);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            tickets: 1
        }
    });

    const ticketCount = watch('tickets') || 0;
    const totalAmount = (ticketCount * (event?.price || 0)).toFixed(2);

    const onSubmit = async (data) => {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setIsConfirmed(true);
    };

    if (!event) return <div className="p-20 text-center text-gray-500">Event not found</div>;

    if (isConfirmed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-white">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-black text-black mb-4 uppercase">Booking Confirmed!</h2>
                    <p className="text-gray-500 mb-10 text-lg">
                        You're going to <span className="text-black font-bold">{event.title}</span>.
                    </p>
                    <Button to="/bookings" variant="primary" className="w-full">
                        View My Bookings
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-neutral-50 p-6">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 shadow-2xl shadow-gray-200 bg-white overflow-hidden">

                {/* Left: Event Summary (Image) */}
                <div className="relative hidden md:block">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10 text-white">
                        <span className="uppercase tracking-widest text-sm font-bold mb-2 text-white/80">Event</span>
                        <h2 className="text-4xl font-black mb-4 leading-none">{event.title}</h2>
                        <div className="flex items-center space-x-6 text-sm font-medium">
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-black mb-2">Complete Booking</h2>
                        <p className="text-gray-400">Please fill in your details below.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            {...register('name')}
                            error={errors.name}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            {...register('email')}
                            error={errors.email}
                        />

                        <Input
                            label="Tickets"
                            type="number"
                            min="1"
                            max="5"
                            {...register('tickets')}
                            error={errors.tickets}
                        />

                        <div className="pt-8 mt-4">
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                                <span className="text-gray-500 font-bold uppercase tracking-wide text-sm">Total Amount</span>
                                <span className="text-4xl font-black text-black">${totalAmount}</span>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full uppercase tracking-widest"
                                isLoading={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                            </Button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Booking;
