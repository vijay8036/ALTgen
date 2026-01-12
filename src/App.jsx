import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import LoadingScanner from './components/LoadingScanner';
import AltResultCard from './components/AltResultCard';
import WebsiteScanner from './components/WebsiteScanner';
import { generateAltText } from './utils/gemini';

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  // -- Image Upload State --
  const [images, setImages] = useState([]);
  const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);

  // Handle new file uploads
  const handleUpload = (files) => {
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      altText: '',
      status: 'pending' // pending, processing, done, error
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const processImage = async (img) => {
    try {
      setImages(prev => prev.map(item => item.id === img.id ? { ...item, status: 'processing', error: null } : item));
      const generatedAlt = await generateAltText(img.file);
      setImages(prev => prev.map(item => item.id === img.id ? { ...item, altText: generatedAlt, status: 'done' } : item));
    } catch (err) {
      setImages(prev => prev.map(item => item.id === img.id ? { ...item, status: 'error', error: err.message } : item));
    }
  };

  const handleGenerateSingle = async (id) => {
    const img = images.find(i => i.id === id);
    if (img) await processImage(img);
  };

  const handleGenerateAll = async () => {
    if (images.length === 0) return;
    setIsGlobalProcessing(true);
    const pendingImages = images.filter(img => !img.altText);
    await Promise.all(pendingImages.map(img => processImage(img)));
    setIsGlobalProcessing(false);
  };

  const handleUpdateAlt = (id, newText) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, altText: newText } : img));
  };

  const handleClear = () => {
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-candy-dark text-gray-200 font-sans selection:bg-candy-btn-start selection:text-white flex overflow-hidden">

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto w-full relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-candy-btn-end/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-candy-btn-start/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto p-4 md:p-12 relative z-10">

          {/* Conditional Mobile Header or Common Header could go here */}
          <header className="mb-12 text-center md:text-left border-b border-white/5 pb-8">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              <span className="text-candy-light block">{activeTab === 'upload' ? 'Generate ALT for' : 'Extract images from'}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy-btn-start to-candy-btn-end">
                {activeTab === 'upload' ? 'your uploads' : 'any website'}
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl font-light">
              {activeTab === 'upload'
                ? 'Drag and drop your images to generate ADA-compliant ALT text instantly.'
                : 'Enter any URL to extract images and generate descriptions automatically.'}
            </p>
          </header>

          {/* TAB CONTENT: UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col gap-4">
                <ImageUploader onUpload={handleUpload} />

                {images.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                    <button
                      onClick={handleClear}
                      className="px-6 py-2 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-all"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleGenerateAll}
                      disabled={isGlobalProcessing}
                      className="candy-btn"
                    >
                      {isGlobalProcessing ? 'Processing All...' : `✨ Generate All (${images.length})`}
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                {isGlobalProcessing && (
                  <div className="mb-8"><LoadingScanner /></div>
                )}

                {images.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-candy-green">Uploaded Images</h2>
                    </div>
                    <div className="grid gap-6">
                      {images.map(img => (
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
            </div>
          )}

          {/* TAB CONTENT: WEBSITE */}
          {activeTab === 'website' && (
            <div className="animate-fade-in">
              <WebsiteScanner />
            </div>
          )}

          <footer className="mt-20 text-center text-gray-600 text-sm pb-8">
            <p>Powered by Google Gemini • React • Tailwind</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
