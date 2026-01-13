import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MdCloudUpload, MdWeb, MdMenu, MdClose } from 'react-icons/md';

const Sidebar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { path: '/upload', icon: <MdCloudUpload className="text-2xl" />, label: 'Upload Image' },
        { path: '/website', icon: <MdWeb className="text-2xl" />, label: 'Web Site' },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            {!isMobileMenuOpen && (
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden fixed top-4 left-4 z-50 p-3 bg-candy-bg/95 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                >
                    <MdMenu className="text-2xl" />
                </button>
            )}

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-candy-dark/95 backdrop-blur-xl flex-shrink-0 flex-col h-screen top-0 z-40
                transition-transform duration-300 ease-in-out
                md:flex md:sticky md:translate-x-0
                ${isMobileMenuOpen ? 'fixed left-0 flex translate-x-0' : 'fixed -translate-x-full'}
            `} style={{ borderRight: '1px solid rgb(255 255 255 / 0.10)' }}>
                <div className="p-8 relative flex items-center" style={{ borderBottom: '1px solid rgb(255 255 255 / 0.10)' }}>
                    <img src="/assets/logo.svg" alt="ALT Gen Logo" className="h-10" />
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-candy-btn-start transition-colors rounded-lg hover:bg-white/5"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 font-medium group ${isActive
                                ? 'bg-gradient-to-r from-candy-btn-start/20 to-candy-btn-end/20 text-white border border-white/10 shadow-lg'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`transition-colors duration-300 ${isActive ? 'text-candy-btn-start' : 'group-hover:text-white'}`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>


                <div className="p-6 border-t border-white/5 text-xs text-gray-500 font-mono">
                    v2.0 • Cyan Theme
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
