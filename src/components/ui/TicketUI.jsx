import { useNavigate } from 'react-router-dom';

export default function TicketUI({ children, className = "", variant = "green" }) {
    // variant: 'green' | 'white' | 'dark'

    const bgClass = {
        green: 'ticket-shape bg-[#00E599] text-black',
        white: 'ticket-shape-white bg-white text-black',
        dark: 'bg-[#111] text-white ticket-mask-vertical'
    }[variant] || 'bg-[#111] text-white';

    return (
        <div className={`relative ${bgClass} ${className} min-h-[160px] flex`}>
            {/* Left/Top Content */}
            <div className="flex-grow p-6 flex flex-col justify-between relative z-10 w-full">
                {children}
            </div>

            {/* Dashed Line (Vertical for standard tickets) */}
            {variant !== 'dark' && (
                <div className="w-[2px] bg-transparent border-l-2 border-dashed border-black/10 my-4 relative">
                </div>
            )}

            {/* Right Content (Stub - "Admit One") */}
            {variant !== 'dark' && (
                <div className="w-16 p-2 flex flex-col justify-center items-center border-l border-dashed border-black/10 relative z-10">
                    <div className="text-[10px] font-black rotate-90 whitespace-nowrap opacity-40 tracking-widest uppercase">
                        Admit One
                    </div>
                </div>
            )}
        </div>
    );
}
