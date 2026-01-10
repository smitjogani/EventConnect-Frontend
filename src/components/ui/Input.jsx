import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`w-full bg-white border-b-2 border-gray-200 px-0 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors ${error ? 'border-red-500' : ''
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500 font-medium">{error.message}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
