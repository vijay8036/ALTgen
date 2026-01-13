import React, { useState } from 'react';
import AltResultCard from './AltResultCard';
import { scanWebsite, generateAltFromUrl } from '../utils/api';
import FullScreenScanningLoader from './FullScreenScanningLoader';
import { MdLanguage, MdSearch, MdRocketLaunch } from 'react-icons/md';

const WebsiteScanner = () => {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scannedImages, setScannedImages] = useState([]);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'duplicates', 'missing'

    const handleScan = async (e) => {
        e.preventDefault();

        let processedUrl = url.trim();
        if (!/^https?:\/\//i.test(processedUrl)) {
            processedUrl = 'https://' + processedUrl;
        }

        setIsScanning(true);
        setError('');
        setScannedImages([]);
        setFilterType('all');

        try {
            const [data] = await Promise.all([
                scanWebsite(processedUrl),
                new Promise(resolve => setTimeout(resolve, 5000)) // Force minimum 5s load time
            ]);

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

    // Filter Logic
    const getFilteredImages = () => {
        if (filterType === 'all') return scannedImages;

        if (filterType === 'duplicates') {
            const altCounts = scannedImages.reduce((acc, img) => {
                const text = img.altText?.trim() || '';
                if (text) { // Only count non-empty strings
                    acc[text] = (acc[text] || 0) + 1;
                }
                return acc;
            }, {});

            return scannedImages.filter(img => {
                const text = img.altText?.trim() || '';
                return text && altCounts[text] > 1;
            });
        }

        if (filterType === 'missing') {
            return scannedImages.filter(img => !img.altText || !img.altText.trim());
        }

        return scannedImages;
    };

    const filteredImages = getFilteredImages();

    return (
        <div className="max-w-4xl mx-auto mt-10 space-y-8">
            {isScanning && <FullScreenScanningLoader scannedUrl={url} />}
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
                                    setFilterType('all');
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
                    <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md py-4 -mx-4 px-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                        <h3 className="text-xl font-bold text-candy-green">
                            Found {scannedImages.length} Images
                            {filterType !== 'all' && <span className="text-sm font-normal text-gray-400 ml-2">({filteredImages.length} shown)</span>}
                        </h3>

                        <div className="relative inline-flex bg-candy-bg border border-white/10 rounded-xl p-1">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === 'all'
                                    ? 'bg-candy-btn-start text-black shadow-lg shadow-candy-btn-start/25'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                All Images
                            </button>
                            <button
                                onClick={() => setFilterType('duplicates')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === 'duplicates'
                                    ? 'bg-candy-btn-start text-black shadow-lg shadow-candy-btn-start/25'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Duplicates
                            </button>
                            <button
                                onClick={() => setFilterType('missing')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === 'missing'
                                    ? 'bg-candy-btn-start text-black shadow-lg shadow-candy-btn-start/25'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Missing ALT
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {filteredImages.length > 0 ? (
                            filteredImages.map(img => (
                                <AltResultCard
                                    key={img.id}
                                    image={img}
                                    altText={img.altText}
                                    onUpdate={handleUpdateAlt}
                                    onGenerate={handleGenerateSingle}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/5">
                                <p>
                                    {filterType === 'duplicates'
                                        ? "No duplicate ALT text found (excluding empty)."
                                        : filterType === 'missing'
                                            ? "No images with missing ALT text found."
                                            : "No images found."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebsiteScanner;
