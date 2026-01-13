import React, { useState } from 'react';
import { MdCheckCircle, MdWarning, MdAutorenew, MdAutoAwesome, MdError, MdContentCopy, MdCheck } from 'react-icons/md';

const AltResultCard = ({ image, altText, onUpdate, onGenerate }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(altText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isValid = altText?.length > 0 && altText?.length <= 100;
    const isGenerating = image.status === 'processing';

    return (
        <div className="candy-card flex flex-col md:flex-row gap-6 items-start relative overflow-hidden group/card">
            <div className="w-full md:w-32 h-32 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 relative group">
                <img
                    src={image.preview}
                    alt="Thumbnail"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isGenerating ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}
                />
                {/* Hover overlay for larger preview eventually? */}
                {isGenerating && (
                    <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[1px] overflow-hidden">
                        {/* Dynamic Neural Data Grid - flickering 'AI processing' effect */}
                        <div className="w-full h-full grid grid-cols-8 grid-rows-8">
                            {Array.from({ length: 64 }).map((_, i) => {
                                // Deterministic random for stable render but chaotic look
                                const randomDelay = (i * 13.7) % 2;
                                const randomDuration = 0.5 + ((i * 3.3) % 1.5); // Fast flickering

                                return (
                                    <div
                                        key={i}
                                        className="w-full h-full flex items-center justify-center"
                                    >
                                        <div
                                            className="w-1 h-1 rounded-full bg-candy-btn-start shadow-[0_0_5px_rgba(74,222,128,0.8)] animate-pulse"
                                            style={{
                                                animationDelay: `${randomDelay}s`,
                                                animationDuration: `${randomDuration}s`,
                                                opacity: 0.3 // Base opacity, pulse takes it up
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {/* Scanning Bar Overlay - Traditional AI scan line added for effect */}
                        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-candy-btn-start to-transparent shadow-[0_0_15px_rgba(74,222,128,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                )}
            </div>

            <div className="flex-grow w-full">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-400 truncate max-w-[200px]">{image.file.name}</span>
                    <div className="flex gap-3 items-center">
                        {altText && (
                            <span className={`text-xs px-3 py-1 rounded-full font-medium border flex items-center gap-1 ${isValid ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                                {isValid ? <MdCheckCircle /> : <MdWarning />}
                                {isValid ? 'ADA Compliant' : 'Review Needed'}
                            </span>
                        )}
                        <button
                            onClick={() => onGenerate(image.id)}
                            disabled={isGenerating}
                            className="text-xs bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-all flex items-center gap-2 hover:border-candy-btn-start/50 group"
                        >
                            <span className={`text-lg ${isGenerating ? 'animate-spin' : 'group-hover:text-candy-btn-start'}`}>
                                {isGenerating ? <MdAutorenew /> : (altText ? <MdAutorenew /> : <MdAutoAwesome />)}
                            </span>
                            {isGenerating ? 'Generating...' : (altText ? 'Regenerate' : 'Generate ALT')}
                        </button>
                    </div>
                </div>

                {image.status === 'error' ? (
                    <div className="w-full min-h-[100px] mb-3 flex flex-col items-center justify-center p-4 border border-red-500/30 bg-red-500/5 rounded-xl text-red-300 text-sm">
                        <span className="mb-2 flex items-center gap-2 text-lg"><MdError /> {image.error || 'Failed to generate'}</span>
                        <button onClick={() => onGenerate(image.id)} className="underline hover:text-white">Try Again</button>
                    </div>
                ) : (
                    <textarea
                        value={altText}
                        onChange={(e) => onUpdate(image.id, e.target.value)}
                        className="candy-input min-h-[100px] mb-4 text-base leading-relaxed bg-black/20 focus:bg-black/40"
                        placeholder={isGenerating ? "Analyzing image structure..." : "ALT text will appear here..."}
                        disabled={isGenerating}
                    />
                )}

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono transition-colors ${altText?.length > 100 ? 'text-red-400' : 'text-gray-500'}`}>
                            {altText?.length || 0} / 100 chars
                        </span>
                        {image.modelUsed && (
                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-candy-btn-end/10 text-candy-btn-end border border-candy-btn-end/20">
                                {image.modelUsed}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleCopy}
                        disabled={!altText}
                        className={`text-sm font-bold transition-all flex items-center gap-2 px-3 py-1 rounded-lg ${!altText ? 'text-gray-600 cursor-not-allowed' : 'text-candy-btn-start hover:bg-candy-btn-start/10'}`}
                    >
                        {copied ? (
                            <>
                                <MdCheck className="text-lg" /> Copied
                            </>
                        ) : (
                            <>
                                <MdContentCopy className="text-lg" /> Copy
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AltResultCard;
