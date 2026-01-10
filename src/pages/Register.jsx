import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left: Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-12 bg-white order-2 lg:order-1">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-black mb-2 uppercase">Create Account</h2>
                        <p className="text-gray-500">Join us for exclusive events.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            {...register('name', { required: 'Name is required' })}
                            error={errors.name}
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                            error={errors.password}
                        />

                        <Button type="submit" variant="primary" size="lg" className="w-full uppercase tracking-widest mt-4">
                            Get Started
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-black font-bold uppercase tracking-wider hover:underline ml-1">
                            Log In
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right: Image Side */}
            <div className="hidden lg:block w-1/2 relative bg-black order-1 lg:order-2">
                <img
                    src="https://images.unsplash.com/photo-1506157788151-584026e5e8e6?w=1200&q=80"
                    alt="Register Cover"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-8xl font-black text-transparent text-stroke stroke-white opacity-20 uppercase tracking-tighter">
                        Join Us
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Register;
