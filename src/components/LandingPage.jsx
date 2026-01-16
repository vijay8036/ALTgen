import React from 'react';
import { Link } from 'react-router-dom';
import { MdRocketLaunch, MdAccessibility, MdBolt, MdAutoAwesome, MdExtension, MdDownload, MdCheckCircle } from 'react-icons/md';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-candy-dark text-white font-sans overflow-x-hidden selection:bg-candy-btn-start selection:text-white">

            {/* Background Glows - Animated */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                {/* Floating gradient orb 1 */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-candy-btn-start/20 rounded-full blur-[120px] animate-float-slow"></div>

                {/* Floating gradient orb 2 */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-candy-btn-end/15 rounded-full blur-[120px] animate-float-reverse"></div>

                {/* Floating gradient orb 3 */}
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px] animate-float-diagonal"></div>

                {/* Additional moving orb 4 */}
                <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] animate-float-horizontal"></div>

                {/* Additional moving orb 5 */}
                <div className="absolute bottom-[30%] left-[10%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[90px] animate-float-vertical"></div>

                {/* New floating orb 6 */}
                <div className="absolute top-[60%] right-[5%] w-[450px] h-[450px] bg-cyan-500/8 rounded-full blur-[110px] animate-float-slow"></div>

                {/* New floating orb 7 */}
                <div className="absolute bottom-[10%] left-[40%] w-[380px] h-[380px] bg-orange-500/8 rounded-full blur-[95px] animate-float-reverse"></div>

                {/* New floating orb 8 */}
                <div className="absolute top-[10%] left-[30%] w-[420px] h-[420px] bg-indigo-500/8 rounded-full blur-[105px] animate-float-horizontal"></div>
            </div>

            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-center items-center">
                <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
                    <img src="/assets/logo.svg" alt="ALT Gen Logo" className="h-20" />
                </Link>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-16 pb-32 text-center relative z-10">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in">
                    <span className="flex h-2 w-2 rounded-full bg-candy-btn-start animate-ping"></span>
                    <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">v2.0 Now Available with Website Scanning</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-heading font-semibold tracking-tight mb-8 leading-tight animate-fade-in-up">
                    <span className="block text-white">Make the Web</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
                        Accessible & Visible
                    </span>
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-100">
                    Generate ADA-compliant alt text for your images and websites instantly.
                    Boost SEO and improve accessibility with our AI-powered engine.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up delay-200">
                    <Link
                        to="/upload"
                        className="group relative px-8 py-4 bg-gradient-to-r from-candy-btn-start to-candy-btn-end rounded-full font-bold text-lg shadow-lg shadow-candy-btn-start/25 hover:shadow-candy-btn-start/40 transition-all hover:-translate-y-1"
                    >
                        <span className="flex items-center gap-2">
                            Start Generating Free <MdRocketLaunch className="group-hover:rotate-45 transition-transform" />
                        </span>
                    </Link>

                    <div className="flex items-center gap-6 px-6 py-4 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm text-sm font-medium text-gray-300">
                        <span className="flex items-center gap-2"><MdAccessibility className="text-candy-btn-start" /> ADA Compliant</span>
                        <span className="flex items-center gap-2"><MdAutoAwesome className="text-yellow-400" /> AI Powered</span>
                        <span className="flex items-center gap-2"><MdBolt className="text-blue-400" /> Instant</span>
                    </div>
                </div>

                {/* WordPress Plugin Section */}
                <div className="mb-20 animate-fade-in-up delay-250">
                    <div className="relative bg-gradient-to-br from-candy-bg/40 to-candy-bg/20 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-candy-btn-end/10 rounded-full blur-[100px] -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-candy-btn-start/10 rounded-full blur-[100px] -z-10"></div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4 backdrop-blur-sm">
                                    <MdExtension className="text-candy-btn-start" />
                                    <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">WordPress Integration</span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-heading font-semibold mb-4">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                                        Download WordPress Plugin
                                    </span>
                                </h2>

                                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                    Integrate ALT text generation directly into your WordPress media library
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                {[
                                    { icon: <MdBolt />, title: "One-Click Install", desc: "Easy setup in minutes" },
                                    { icon: <MdAutoAwesome />, title: "Bulk Processing", desc: "Generate for all images" },
                                    { icon: <MdCheckCircle />, title: "Free Forever", desc: "No hidden costs" }
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                                        <div className="text-4xl text-candy-btn-start mb-3 group-hover:scale-110 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <div className="text-center">
                                <Link
                                    to="/download"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-candy-btn-start to-candy-btn-end rounded-full font-bold text-lg shadow-lg shadow-candy-btn-start/25 hover:shadow-candy-btn-start/40 transition-all hover:-translate-y-1 group"
                                >
                                    <MdDownload className="text-2xl group-hover:animate-bounce" />
                                    Download WordPress Plugin
                                </Link>
                                <p className="text-sm text-gray-500 mt-4">
                                    Compatible with WordPress 5.0+ • Latest Version 2.0
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Mockup */}
                <div className="relative mx-auto max-w-5xl group perspective-1000 animate-fade-in-up delay-300">
                    {/* Background Gradient for Mockup */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-candy-btn-start via-purple-500 to-candy-btn-end rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative rounded-2xl bg-gray-900 border border-white/10 shadow-2xl overflow-shown">
                        {/* Window Controls */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/40 rounded-t-2xl">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <div className="ml-4 px-3 py-1 bg-white/5 rounded-md text-xs text-gray-500 flex-1 text-center font-mono">
                                alt-gen.app/dashboard
                            </div>
                        </div>

                        {/* Content Mockup (simplified view of the app) */}
                        <div className="aspect-[16/9] bg-gray-900/90 relative overflow-hidden flex">
                            {/* Sidebar Mock */}
                            <div className="w-48 bg-gray-800/20 border-r border-white/5 hidden sm:flex flex-col p-4 gap-4">
                                <div className="h-8 w-24 bg-white/10 rounded-lg animate-pulse"></div>
                                <div className="h-10 w-full bg-candy-btn-start/20 border border-candy-btn-start/30 rounded-lg"></div>
                                <div className="h-10 w-full bg-white/5 rounded-lg"></div>
                                <div className="h-10 w-full bg-white/5 rounded-lg"></div>
                            </div>

                            {/* Main Content Mock */}
                            <div className="flex-1 p-8 grid grid-cols-2 gap-6 bg-gradient-to-br from-gray-900 to-black">
                                {/* Cards */}
                                <div className="col-span-2 h-16 bg-white/5 rounded-xl border border-white/5 flex items-center px-4">
                                    <div className="h-6 w-48 bg-white/10 rounded animate-pulse"></div>
                                </div>

                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-candy-bg/50 backdrop-blur-md rounded-xl p-4 border border-white/5 shadow-lg flex flex-col gap-3">
                                        <div className="w-full aspect-video bg-black/40 rounded-lg overflow-hidden relative">
                                            <div className="absolute inset-x-0 h-[1px] top-0 bg-candy-btn-start/50 animate-scan" style={{ animationDuration: '3s' }}></div>
                                        </div>
                                        <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                                        <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Overlay on Hover */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] rounded-b-2xl">
                            <Link to="/upload" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                                Try Demo
                            </Link>
                        </div>
                    </div>
                </div>

            </main>

            <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
                <p>© 2026 ALT Gen. Built for accessibility.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
