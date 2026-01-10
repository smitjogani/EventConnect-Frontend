import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: 'text-red-500',
            button: 'bg-red-500 hover:bg-red-600',
            border: 'border-red-500/20'
        },
        warning: {
            icon: 'text-yellow-500',
            button: 'bg-yellow-500 hover:bg-yellow-600',
            border: 'border-yellow-500/20'
        },
        info: {
            icon: 'text-[#00E599]',
            button: 'bg-[#00E599] hover:bg-white text-black',
            border: 'border-[#00E599]/20'
        }
    };

    const style = typeStyles[type] || typeStyles.danger;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`bg-[#111] border ${style.border} rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl`}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 ${style.icon}`}>
                                <AlertTriangle size={32} className="stroke-[2.5px]" />
                            </div>

                            {/* Content */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
                                    {title}
                                </h2>
                                <p className="text-gray-400 leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest py-3 px-6 rounded-xl transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 ${style.button} font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-colors`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
