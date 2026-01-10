import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left: Image Side */}
            <div className="hidden lg:block w-1/2 relative bg-black">
                <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80"
                    alt="Login Cover"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-8xl font-black text-transparent text-stroke stroke-white opacity-20 uppercase tracking-tighter">
                        Access
                    </h1>
                </div>
                <div className="absolute bottom-10 left-10 text-white">
                    <p className="font-bold uppercase tracking-widest text-sm mb-1">Event Connect</p>
                    <p className="text-gray-400 text-xs">© 2026 All Rights Reserved.</p>
                </div>
            </div>

            {/* Right: Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-12 bg-white">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-black mb-2 uppercase">Welcome Back</h2>
                        <p className="text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                            {...register('password', { required: 'Password is required' })}
                            error={errors.password}
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-500 cursor-pointer hover:text-black transition-colors">
                                <input type="checkbox" className="mr-2 rounded-none border-gray-300 text-black focus:ring-black" />
                                Remember for 30 days
                            </label>
                            <a href="#" className="text-black font-bold uppercase text-xs tracking-wider border-b border-transparent hover:border-black transition-all">Forgot Password?</a>
                        </div>

                        <Button type="submit" variant="primary" size="lg" className="w-full uppercase tracking-widest">
                            Log In
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-black font-bold uppercase tracking-wider hover:underline ml-1">
                            Sign Up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
