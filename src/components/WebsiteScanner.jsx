import React, { useState } from 'react';
import AltResultCard from './AltResultCard';
import { scanWebsite, generateAltFromUrl } from '../utils/api';
import { MdLanguage, MdSearch, MdRocketLaunch } from 'react-icons/md';

const WebsiteScanner = () => {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scannedImages, setScannedImages] = useState([]);
    const [error, setError] = useState('');

    const handleScan = async (e) => {
        e.preventDefault();

        let processedUrl = url.trim();
        if (!/^https?:\/\//i.test(processedUrl)) {
            processedUrl = 'https://' + processedUrl;
        }

        setIsScanning(true);
        setError('');
        setScannedImages([]);

        try {
            const data = await scanWebsite(processedUrl);

            if (data.images && data.images.length > 0) {
                const mappedImages = data.images.map(img => ({
                    id: Math.random().toString(36).substr(2, 9),
                    file: { name: img.src.split('/').pop() || 'image.jpg' },
                    preview: img.src,
                    altText: img.originalAlt || '',
                    status: 'pending',
                    isRemote: true
                }));
                setScannedImages(mappedImages);
            } else {
                setError("No suitable images found on this page.");
            }

        } catch (err) {
            setError(err.message || "Failed to scan website.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleGenerateSingle = async (id) => {
        const img = scannedImages.find(i => i.id === id);
        if (!img) return;

        setScannedImages(prev => prev.map(item => item.id === id ? { ...item, status: 'processing', error: null } : item));

        try {
            const { altText, modelUsed } = await generateAltFromUrl(img.preview);
            setScannedImages(prev => prev.map(item => item.id === id ? { ...item, altText, modelUsed, status: 'done' } : item));
        } catch (err) {
            setScannedImages(prev => prev.map(item => item.id === id ? { ...item, status: 'error', error: err.message } : item));
        }
    };

    const handleUpdateAlt = (id, newText) => {
        setScannedImages(prev => prev.map(img => img.id === id ? { ...img, altText: newText } : img));
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 space-y-8">
            <div className="candy-card p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl text-candy-btn-start"><MdLanguage /></span> Scan Website Images
                </h2>

                <form onSubmit={handleScan} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Website URL</label>
                        <input
                            type="text"
                            required
                            placeholder="example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="candy-input text-lg"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isScanning || !url}
                            className="candy-btn flex-grow flex justify-center items-center gap-2"
                        >
                            <span className="text-xl">{isScanning ? <MdSearch className="animate-spin" /> : <MdRocketLaunch />}</span>
                            {isScanning ? 'Scanning URL...' : 'Fetch Images'}
                        </button>
                        {(url || scannedImages.length > 0) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setUrl('');
                                    setScannedImages([]);
                                    setError('');
                                }}
                                className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Results Grid */}
            {scannedImages.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-candy-green">Found {scannedImages.length} Images</h3>
                    <div className="grid gap-6">
                        {scannedImages.map(img => (
                            <AltResultCard
                                key={img.id}
                                image={img}
                                altText={img.altText}
                                onUpdate={handleUpdateAlt}
                                onGenerate={handleGenerateSingle}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebsiteScanner;
