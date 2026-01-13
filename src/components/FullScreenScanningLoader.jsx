import React, { useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';

const FullScreenScanningLoader = () => {
    const [messages, setMessages] = useState("Initializing Scanner protocol...");

    useEffect(() => {
        const msgs = [
            "Accessing URL...",
            "Analyzing layout structure...",
            "Detecting image assets...",
            "filtering hidden elements...",
            "Verifying accessibility nodes...",
            "Extracting visual data...",
            "Compiling results..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            setMessages(msgs[i]);
            i = (i + 1) % msgs.length;
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-candy-dark/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden font-sans text-white">

            {/* Background Animated Gradients */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-candy-btn-start/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-candy-btn-end/20 rounded-full blur-[100px] pointer-events-none" style={{ animationDelay: '1s' }}></div>

            {/* Central Card */}
            <div className="candy-card relative z-20 flex flex-col items-center gap-8 p-10 min-w-[340px] max-w-md mx-6 border border-white/10 shadow-2xl shadow-candy-btn-start/20">

                {/* Scanning Animation Container */}
                <div className="relative w-48 h-48 bg-black/50 rounded-2xl overflow-hidden border border-white/10 shadow-inner group">

                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}>
                    </div>

                    {/* Random Flickering Nodes (Neural Net Effect) */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 p-2 gap-1">
                        {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-candy-btn-start animate-ping"
                                    style={{
                                        animationDuration: `${0.8 + Math.random() * 1.5}s`,
                                        animationDelay: `${Math.random()}s`,
                                        opacity: Math.random() * 0.5
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Icon in Center */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-candy-btn-start/20 to-candy-btn-end/20 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center shadow-lg">
                            <MdSearch className="text-4xl text-white drop-shadow-md animate-pulse" />
                        </div>
                    </div>

                    {/* Scanning Beam (Standardized from index.css) */}
                    <div className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-candy-btn-start to-transparent shadow-[0_0_20px_rgba(255,109,90,0.9)] animate-scan"></div>

                </div>

                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-candy-btn-start to-candy-btn-end animate-pulse">
                        System Scanning
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-candy-btn-start animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-candy-btn-start animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-candy-btn-start animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-gray-300 text-sm font-medium tracking-wide uppercase opacity-80">
                        {messages}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FullScreenScanningLoader;
