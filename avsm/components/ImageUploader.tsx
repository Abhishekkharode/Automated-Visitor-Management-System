import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageReady: (previewUrl: string, base64Data: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageReady }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const previewUrl = reader.result as string;
        const base64Data = previewUrl.split(',')[1];
        onImageReady(previewUrl, base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [onImageReady]);


  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold text-cyan-500 mb-2">Upload Visitor Image</h2>
      <p className="text-gray-500 mb-8 max-w-lg">
        Select or drag & drop a file to begin the analysis.
      </p>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full max-w-2xl h-64 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-cyan-400 bg-cyan-50' : 'border-gray-300 hover:border-cyan-400 hover:bg-gray-50'}`}
      >
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <UploadIcon className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-700">
            <span className="text-cyan-500">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500">JPG, PNG, or WEBP</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
          aria-label="File uploader"
        />
      </label>
    </div>
  );
};