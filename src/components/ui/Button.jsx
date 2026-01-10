import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const variants = {
    primary: 'bg-black text-white hover:bg-zinc-800 border border-transparent',
    secondary: 'bg-gray-100 text-black hover:bg-gray-200 border border-transparent',
    outline: 'bg-transparent text-black border border-black hover:bg-black hover:text-white',
    ghost: 'bg-transparent text-black hover:bg-gray-50',
    white: 'bg-white text-black hover:bg-gray-100 border border-transparent shadow-sm'
};

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    to = null,
    onClick,
    disabled = false,
    isLoading = false,
    type = 'button',
    icon = null,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
        <>
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            )}
            {children}
            {icon && <span className="ml-2">{icon}</span>}
            {!icon && variant === 'primary' && !isLoading && (
                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            )}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={`${combinedClassName} group`} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            type={type}
            className={`${combinedClassName} group`}
            onClick={onClick}
            disabled={disabled || isLoading}
            {...props}
        >
            {content}
        </motion.button>
    );
};

export default Button;
