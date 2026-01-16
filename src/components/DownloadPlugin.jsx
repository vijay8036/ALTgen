import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MdDownload,
    MdCheckCircle,
    MdUpload,
    MdSettings,
    MdRocketLaunch,
    MdArrowBack,
    MdFolder,
    MdExtension,
    MdPlayArrow,
    MdAutoAwesome,
    MdSpeed,
    MdFilterAlt,
    MdAccessibility,
    MdDashboard,
    MdCloud,
    MdCode,
    MdKey,
    MdSave,
    MdImage,
    MdDelete
} from 'react-icons/md';

const DownloadPlugin = () => {
    const [downloadStarted, setDownloadStarted] = useState(false);
    const [activeSection, setActiveSection] = useState('features');

    // Scroll to section function
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100; // Offset for fixed header
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
            setActiveSection(sectionId);
        }
    };

    // Track scroll position to update active section
    React.useEffect(() => {
        const handleScroll = () => {
            const sections = ['features', 'requirements', 'installation', 'configuration', 'usage', 'cta'];
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDownload = () => {
        setDownloadStarted(true);
        const link = document.createElement('a');
        link.href = 'https://github.com/vijay8036/ATLplugin/raw/refs/heads/main/alt-text-generator.zip';
        link.download = 'alt-text-generator.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => setDownloadStarted(false), 3000);
    };


    const features = [
        { icon: <MdAutoAwesome />, title: "AI-Powered Generation", desc: "Leverage OpenAI GPT-4o or Google Gemini Flash 1.5 for intelligent ALT text" },
        { icon: <MdSpeed />, title: "Smart Mode", desc: "Automatic fallback from Gemini to GPT for maximum reliability" },
        { icon: <MdRocketLaunch />, title: "Bulk Processing", desc: "Generate ALT text for multiple images at once" },
        { icon: <MdExtension />, title: "Media Library Integration", desc: "Seamless integration with WordPress media library" },
        { icon: <MdFilterAlt />, title: "Filter & Search", desc: "Filter images by ALT text status (missing, existing, all)" },
        { icon: <MdDashboard />, title: "Progress Tracking", desc: "Real-time progress indicators during bulk operations" },
        { icon: <MdAccessibility />, title: "ADA Compliance", desc: "Generate accessibility-compliant descriptions" },
        { icon: <MdDashboard />, title: "Modern UI", desc: "Clean, intuitive interface with responsive design" }
    ];

    const installationMethods = [
        {
            title: "Method 1: Upload via WordPress Admin",
            badge: "Recommended",
            color: "from-green-500 to-emerald-500",
            steps: [
                { icon: <MdDownload />, title: "Download the Plugin", desc: "Download the alt-text-generator.zip file from the repository" },
                { icon: <MdFolder />, title: "Access WordPress Admin", desc: "Log in to your WordPress admin dashboard and navigate to Plugins → Add New" },
                { icon: <MdUpload />, title: "Upload Plugin", desc: "Click Upload Plugin, choose the .zip file, and click Install Now" },
                { icon: <MdCheckCircle />, title: "Activate Plugin", desc: "Once installation is complete, click Activate Plugin" }
            ]
        },
        {
            title: "Method 2: Manual Installation via FTP",
            badge: "Advanced",
            color: "from-blue-500 to-cyan-500",
            steps: [
                { icon: <MdFolder />, title: "Extract the Plugin", desc: "Download and extract the alt-text-generator.zip file" },
                { icon: <MdCloud />, title: "Upload to WordPress", desc: "Connect via FTP and upload the folder to /wp-content/plugins/" },
                { icon: <MdCheckCircle />, title: "Activate Plugin", desc: "Go to Plugins → Installed Plugins and activate ALT Text Generator (AI)" }
            ]
        },
        {
            title: "Method 3: Manual Installation via cPanel",
            badge: "Alternative",
            color: "from-purple-500 to-pink-500",
            steps: [
                { icon: <MdCode />, title: "Access cPanel", desc: "Log in to your hosting cPanel and open File Manager" },
                { icon: <MdFolder />, title: "Navigate to Plugins", desc: "Go to public_html/wp-content/plugins/" },
                { icon: <MdUpload />, title: "Upload and Extract", desc: "Upload the .zip file, extract it, and delete the zip" },
                { icon: <MdCheckCircle />, title: "Activate Plugin", desc: "Activate from WordPress admin Plugins page" }
            ]
        }
    ];

    const configSteps = [
        {
            icon: <MdSettings />,
            title: "Access Plugin Settings",
            desc: "After activation, go to Settings → ALT Generator in your WordPress admin menu"
        },
        {
            icon: <MdAutoAwesome />,
            title: "Choose AI Provider",
            desc: "Select Smart Auto (recommended), Gemini Only, or GPT Only mode"
        },
        {
            icon: <MdKey />,
            title: "Add API Keys",
            desc: "Get your Gemini key from Google AI Studio or OpenAI key from OpenAI Platform",
            details: [
                { provider: "Google Gemini", url: "https://makersuite.google.com/app/apikey", format: "AIza..." },
                { provider: "OpenAI GPT", url: "https://platform.openai.com/api-keys", format: "sk-..." }
            ]
        },
        {
            icon: <MdSave />,
            title: "Save Configuration",
            desc: "Click Save Configuration button and you're ready to use!"
        }
    ];

    const usageSteps = [
        {
            title: "Accessing the ALT Generator",
            icon: <MdFolder />,
            desc: "Go to Media → Library in WordPress admin, then click on the ALT Generator tab"
        },
        {
            title: "For Single Images",
            icon: <MdImage />,
            desc: "Click on an image in the media library, look for the Generate ALT button, and click to generate"
        },
        {
            title: "For Bulk Generation",
            icon: <MdRocketLaunch />,
            desc: "Use the Filter dropdown (All Images, Missing ALT, Has ALT), then click Generate ALT Text button"
        },
        {
            title: "Deleting ALT Text",
            icon: <MdDelete />,
            desc: "Select images and click Delete ALT Text button, then confirm the action"
        }
    ];

    return (
        <div className="min-h-screen bg-candy-dark text-white font-sans selection:bg-candy-btn-start selection:text-white">

            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-candy-btn-start/20 rounded-full blur-[120px] animate-float-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-candy-btn-end/15 rounded-full blur-[120px] animate-float-reverse"></div>
                <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px] animate-float-diagonal"></div>
            </div>

            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center relative z-10">
                <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
                    <img src="/assets/logo.svg" alt="ALT Gen Logo" className="h-20" />
                </Link>
                <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                    <MdArrowBack /> Back to Home
                </Link>
            </nav>

            {/* Header Section - Full Width */}
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 relative z-10">
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <MdExtension className="text-candy-btn-start" />
                        <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">WordPress Plugin</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-heading font-semibold tracking-tight mb-6 leading-tight">
                        <span className="block text-white mb-2">ALT Text Generator</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
                            AI-Powered WordPress Plugin
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Seamlessly integrate AI-powered alt text generation directly into your WordPress media library
                    </p>

                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        className={`group relative px-10 py-5 bg-gradient-to-r from-candy-btn-start to-candy-btn-end rounded-full font-bold text-lg shadow-lg shadow-candy-btn-start/25 hover:shadow-candy-btn-start/40 transition-all hover:-translate-y-1 ${downloadStarted ? 'scale-95' : ''}`}
                    >
                        <span className="flex items-center gap-3">
                            {downloadStarted ? (
                                <>
                                    <MdCheckCircle className="text-2xl animate-bounce" />
                                    Download Started!
                                </>
                            ) : (
                                <>
                                    <MdDownload className="text-2xl group-hover:animate-bounce" />
                                    Download Plugin (v2.0)
                                </>
                            )}
                        </span>
                    </button>

                    <p className="text-sm text-gray-500 mt-4">
                        Free • Latest Version • Compatible with WordPress 5.0+ • PHP 7.4+
                    </p>
                </div>
            </div>

            {/* Main Content with Sidebar */}
            <div className="max-w-7xl mx-auto px-6 pb-12 relative z-10 flex gap-8">

                {/* Left Sidebar Navigation */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                        <div className="bg-candy-bg/30 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">On This Page</h3>
                            <nav className="space-y-2">
                                {[
                                    { id: 'features', icon: '🌟', label: 'Features' },
                                    { id: 'requirements', icon: '📋', label: 'Requirements' },
                                    { id: 'installation', icon: '🚀', label: 'Installation' },
                                    { id: 'configuration', icon: '⚙️', label: 'Configuration' },
                                    { id: 'usage', icon: '📖', label: 'Usage Guide' },
                                    { id: 'cta', icon: '🎯', label: 'Get Started' }
                                ].map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-3 ${activeSection === section.id
                                            ? 'bg-gradient-to-r from-candy-btn-start to-candy-btn-end text-white font-semibold'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="text-lg">{section.icon}</span>
                                        <span className="text-sm">{section.label}</span>
                                    </button>
                                ))}
                            </nav>

                            {/* Quick Download Button in Sidebar */}
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <button
                                    onClick={handleDownload}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-candy-btn-start to-candy-btn-end rounded-lg font-bold text-sm shadow-lg hover:shadow-candy-btn-start/40 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <MdDownload className="text-lg" />
                                    Quick Download
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">

                    {/* Features Section */}
                    <div id="features" className="mb-16 scroll-mt-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy-btn-start to-candy-btn-end">
                                    🌟 Features
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg">Everything you need for accessible images</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="group bg-candy-bg/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1"
                                >
                                    <div className="text-4xl text-candy-btn-start mb-4 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Requirements Section */}
                    <div id="requirements" className="mb-16 bg-gradient-to-br from-candy-bg/40 to-candy-bg/20 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/5 scroll-mt-24">
                        <h2 className="text-3xl font-heading font-semibold mb-8 text-center">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy-btn-start to-candy-btn-end">
                                📋 Requirements
                            </span>
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="text-4xl mb-3">🔧</div>
                                <h3 className="font-bold text-white mb-2">WordPress</h3>
                                <p className="text-gray-400">Version 5.0 or higher</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="text-4xl mb-3">⚡</div>
                                <h3 className="font-bold text-white mb-2">PHP</h3>
                                <p className="text-gray-400">Version 7.4 or higher</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="text-4xl mb-3">🔑</div>
                                <h3 className="font-bold text-white mb-2">API Keys</h3>
                                <p className="text-gray-400">Gemini or OpenAI GPT</p>
                            </div>
                        </div>
                    </div>

                    {/* Installation Methods */}
                    <div id="installation" className="mb-16 scroll-mt-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy-btn-start to-candy-btn-end">
                                    🚀 Installation Methods
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg">Choose the method that works best for you</p>
                        </div>

                        <div className="space-y-8">
                            {installationMethods.map((method, idx) => (
                                <div
                                    key={idx}
                                    className="bg-candy-bg/30 backdrop-blur-md rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <h3 className="text-2xl font-bold text-white">{method.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${method.color} text-white`}>
                                            {method.badge}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {method.steps.map((step, stepIdx) => (
                                            <div key={stepIdx} className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center text-sm font-bold`}>
                                                        {stepIdx + 1}
                                                    </div>
                                                    <div className="text-2xl text-candy-btn-start">
                                                        {step.icon}
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-white mb-2 text-sm">{step.title}</h4>
                                                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Configuration Section */}
                    <div id="configuration" className="mb-16 scroll-mt-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy-btn-start to-candy-btn-end">
                                    ⚙️ Configuration
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg">Set up your API keys in 4 simple steps</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {configSteps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="bg-candy-bg/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-candy-btn-start to-candy-btn-end flex items-center justify-center text-2xl flex-shrink-0">
                                            {step.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                                            <p className="text-gray-400 mb-3">{step.desc}</p>

                                            {step.details && (
                                                <div className="space-y-2 mt-4">
                                                    {step.details.map((detail, detailIdx) => (
                                                        <div key={detailIdx} className="bg-white/5 rounded-lg p-3">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="font-semibold text-sm text-candy-btn-start">{detail.provider}</span>
                                                                <code className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">{detail.format}</code>
                                                            </div>
                                                            <a
                                                                href={detail.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-400 hover:text-blue-300 underline break-all"
                                                            >
                                                                {detail.url}
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Usage Guide Section */}
                    <div id="usage" className="mb-16 scroll-mt-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy-btn-start to-candy-btn-end">
                                    📖 Usage Guide
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg">How to use the plugin effectively</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {usageSteps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gradient-to-br from-candy-bg/40 to-candy-bg/20 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl text-candy-btn-start flex-shrink-0">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                                            <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Usage Tips */}
                        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MdFilterAlt className="text-blue-400" />
                                <span className="text-white">Filter Options</span>
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold text-white mb-2">All Images</h4>
                                    <p className="text-gray-400 text-sm">Show all images in your media library</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold text-white mb-2">Missing ALT</h4>
                                    <p className="text-gray-400 text-sm">Show only images without ALT text</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold text-white mb-2">Has ALT</h4>
                                    <p className="text-gray-400 text-sm">Show only images with existing ALT text</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div id="cta" className="text-center bg-gradient-to-r from-candy-btn-start/10 to-candy-btn-end/10 rounded-3xl p-12 border border-candy-btn-start/20 scroll-mt-24">
                        <h2 className="text-3xl font-heading font-semibold mb-4">Ready to Get Started?</h2>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Download the plugin now and make your WordPress site more accessible
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/upload"
                                className="px-8 py-4 bg-white text-candy-dark rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                <MdPlayArrow className="text-xl" />
                                Try Web App First
                            </Link>
                            <button
                                onClick={handleDownload}
                                className="px-8 py-4 bg-gradient-to-r from-candy-btn-start to-candy-btn-end rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                <MdDownload className="text-xl" />
                                Download Plugin Now
                            </button>
                        </div>
                    </div>

                </main>

            </div>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm mt-20">
                <p>© 2026 ALT Gen. Built for accessibility.</p>
            </footer>
        </div>
    );
};

export default DownloadPlugin;
