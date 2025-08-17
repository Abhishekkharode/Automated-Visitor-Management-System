import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { AnalysisResultCard } from './AnalysisResultCard';
import { AnalysisEditCard } from './AnalysisEditCard';
import { Spinner } from './Spinner';
import { analyzeVisitorImage } from '../services/geminiService';
import type { VisitorProfile, LoggedVisitor } from '../types';
import { CameraCapture } from './CameraCapture';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';

interface ScannerProps {
  onCancel: () => void;
  onScanComplete: (visitor: LoggedVisitor) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onCancel, onScanComplete }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VisitorProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<VisitorProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'camera' | 'upload'>('camera');

  const handleImageReady = useCallback(async (previewUrl: string, base64Data: string) => {
    setImagePreview(previewUrl);
    setAnalysisResult(null);
    setEditedProfile(null);
    setIsEditing(false);
    setError(null);
    setIsLoading(true);

    try {
      const result = await analyzeVisitorImage(base64Data);
      setAnalysisResult(result);
      setEditedProfile(result); // Initialize the editable profile with the AI's result
    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Failed to analyze the image. The AI may be unable to process this picture, or an API error occurred. Please try another image.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setImagePreview(null);
    setAnalysisResult(null);
    setEditedProfile(null);
    setIsEditing(false);
    setError(null);
    setIsLoading(false);
  };
  
  const handleSave = () => {
    if (!editedProfile || !imagePreview || !analysisResult) return;
    
    const newVisitor: LoggedVisitor = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        checkOutTime: null,
        status: 'Checked-in',
        photo: imagePreview,
        rawProfile: analysisResult, // Store the original AI result
        enhancedProfile: editedProfile // Store the final, potentially edited result
    };
    onScanComplete(newVisitor);
  };

  const handleProfileUpdate = (updatedProfile: VisitorProfile) => {
    setEditedProfile(updatedProfile);
  };

  return (
    <div className="w-full p-4 sm:p-8 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl transition-all duration-500 animate-fade-in">
      {!imagePreview ? (
        <div>
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 rounded-full p-1 flex gap-1">
              <button
                onClick={() => setInputMode('camera')}
                aria-pressed={inputMode === 'camera'}
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors duration-300 ${inputMode === 'camera' ? 'bg-cyan-500 text-slate-900 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <CameraIcon className="w-5 h-5" />
                Live Camera
              </button>
              <button
                onClick={() => setInputMode('upload')}
                 aria-pressed={inputMode === 'upload'}
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors duration-300 ${inputMode === 'upload' ? 'bg-cyan-500 text-slate-900 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <UploadIcon className="w-5 h-5" />
                Upload Image
              </button>
            </div>
          </div>
          
          {inputMode === 'camera' ? (
            <CameraCapture onImageReady={handleImageReady} />
          ) : (
            <ImageUploader onImageReady={handleImageReady} />
          )}

          <div className="text-center mt-8">
             <button
                onClick={onCancel}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Back to Dashboard
              </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-cyan-500">Visitor Image</h2>
            <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
              <img src={imagePreview} alt="Visitor" className="w-full h-full object-cover" />
              {isLoading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
                  <Spinner />
                  <p className="text-lg text-cyan-300 animate-pulse">AI is analyzing...</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg w-full max-w-md text-center">
                <h3 className="font-bold text-lg mb-2">Analysis Failed</h3>
                <p>{error}</p>
              </div>
            )}

            {editedProfile && !isLoading && !error && (
              isEditing ? (
                <AnalysisEditCard profile={editedProfile} onUpdate={handleProfileUpdate} />
              ) : (
                <AnalysisResultCard profile={editedProfile} onEdit={() => setIsEditing(true)} />
              )
            )}
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
               {editedProfile && !isLoading && !error && (
                 <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    {isEditing ? 'Confirm & Save' : 'Save Visitor'}
                  </button>
               )}
               <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Scan Again
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};