import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdCloudUpload, MdWeb, MdSettings } from 'react-icons/md';

const Sidebar = () => {
    const menuItems = [
        { path: '/upload', icon: <MdCloudUpload className="text-2xl" />, label: 'Upload Image' },
        { path: '/website', icon: <MdWeb className="text-2xl" />, label: 'Web Site' },
    ];

    return (
        <aside className="w-64 bg-candy-dark/95 backdrop-blur-xl border-r border-white/5 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-8 border-b border-white/5">
                <img src="/assets/logo.svg" alt="ALT Gen Logo" className="h-10" />
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
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
                v2.0 • n8n Theme
            </div>
        </aside>
    );
};

export default Sidebar;
