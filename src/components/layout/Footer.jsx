import { Ticket, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="font-black text-2xl tracking-tighter text-white">
                                EVENT<span className="text-[#00E599]">CONNECT</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The premier platform for discovering and booking the world's most exciting events. seamless, secure, and smart.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Linkedin, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {[
                        { title: 'Platform', links: ['Browse Events', 'How it Works', 'Pricing', 'Sell Tickets'] },
                        { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
                        { title: 'Legal', links: ['Terms of Use', 'Privacy Policy', 'Cookie Policy', 'Security'] }
                    ].map((col, idx) => (
                        <div key={idx}>
                            <h4 className="font-bold mb-6">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map((link, i) => (
                                    <li key={i}>
                                        <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
                    <p className="text-gray-500 text-sm">© 2026 Event Connect Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
