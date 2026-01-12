import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; // We need to install this
import { MdCloudUpload } from 'react-icons/md';

const ImageUploader = ({ onUpload }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            onUpload(acceptedFiles);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        }
    });

    return (
        <div
            {...getRootProps()}
            className={`candy-card border-2 border-dashed cursor-pointer flex flex-col items-center justify-center p-10 min-h-[200px] text-center transition-all duration-300
        ${isDragActive ? 'border-candy-btn-start bg-candy-btn-start/5' : 'border-white/10 hover:border-candy-btn-start/50 hover:bg-white/5'}
      `}
        >
            <input {...getInputProps()} />
            <div className={`text-6xl mb-4 transition-transform duration-300 ${isDragActive ? 'scale-110 text-candy-btn-start' : 'text-gray-500'}`}>
                <MdCloudUpload />
            </div>
            {isDragActive ? (
                <p className="text-lg font-bold text-candy-green">Drop the images here...</p>
            ) : (
                <div>
                    <p className="text-lg font-bold mb-2">Drag & drop images here, or click to select</p>
                    <p className="text-sm text-gray-400">Supports JPG, PNG, WEBP</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
